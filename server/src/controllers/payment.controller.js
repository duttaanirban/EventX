import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { withTransactionRetry } from '../utils/withTransactionRetry.js';
import { createQrPayload, generateQrDataUrl } from '../utils/qr.js';
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature
} from '../services/payment.service.js';
import { emailService } from '../services/email.service.js';
import { getIo } from '../socket/index.js';
import { env } from '../config/env.js';
import { invalidateEventCaches } from '../services/cache.service.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { eventId, ticketCount } = req.body;
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.availableSeats < ticketCount) throw new ApiError(409, 'Not enough seats available');

  const amount = event.ticketPrice * ticketCount;
  if (amount < 1) throw new ApiError(400, 'Paid checkout requires a ticket price of at least INR 1');

  let order;
  try {
    order = await createRazorpayOrder({
      amount,
      receipt: `evt_${Date.now().toString(36)}_${event._id.toString().slice(-8)}`
    });
  } catch (error) {
    const message =
      error?.error?.description ||
      error?.description ||
      error?.message ||
      'Unable to create Razorpay order';

    console.error('Razorpay order creation failed', {
      statusCode: error?.statusCode,
      code: error?.error?.code,
      description: message
    });

    throw new ApiError(error?.statusCode || 502, message);
  }

  const payment = await Payment.create({
    user: req.user._id,
    event: event._id,
    amount,
    ticketCount,
    razorpayOrderId: order.id
  });

  res.status(201).json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: env.razorpayKeyId,
      paymentId: payment._id
    }
  });
});

/**
 * Shared booking-confirmation logic. Called from both the client-driven
 * /verify endpoint AND the Razorpay webhook (payment.captured), so that
 * whichever path reaches the payment first "wins" and the other is a
 * no-op — this is what makes booking creation idempotent regardless of
 * which trigger fires first or if both fire.
 *
 * Must be called with an active, already-started session.
 * Throws ApiError on failure; caller is responsible for session lifecycle.
 */
async function confirmBookingFromPayment({
  session,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
}) {
  let booking;

  await withTransactionRetry(session, async () => {
    const payment = await Payment.findOne({ razorpayOrderId }).session(session);
    if (!payment) throw new ApiError(404, 'Payment order not found');

    // Idempotency guard: if this payment was already confirmed by the other
    // path (client /verify or webhook), skip silently instead of erroring —
    // this lets the webhook safely re-process a payment the client already verified.
    if (payment.paymentStatus === 'paid') {
      booking = await Booking.findById(payment.booking).session(session);
      return;
    }

    const event = await Event.findOneAndUpdate(
      { _id: payment.event, availableSeats: { $gte: payment.ticketCount } },
      {
        $inc: { availableSeats: -payment.ticketCount },
        $addToSet: { attendees: payment.user }
      },
      { new: true, session }
    );
    if (!event) {
      throw new ApiError(409, 'Seats are no longer available');
    }

    booking = new Booking({
      user: payment.user,
      event: payment.event,
      ticketCount: payment.ticketCount,
      bookingStatus: 'confirmed',
      qrCode: 'pending',
      qrPayload: { pending: true }
    });
    await booking.save({ session });

    const payload = createQrPayload({ bookingId: booking._id, eventId: event._id });
    booking.qrPayload = payload;
    booking.qrCode = await generateQrDataUrl(payload);
    await booking.save({ session });

    payment.paymentStatus = 'paid';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.booking = booking._id;
    await payment.save({ session });

    booking.paymentId = payment._id;
    await booking.save({ session });
  });

  return booking;
}

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const isValid = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature
  });
  if (!isValid) throw new ApiError(400, 'Payment signature mismatch');

  const session = await mongoose.startSession();
  let booking;
  try {
    booking = await confirmBookingFromPayment({
      session,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });
  } finally {
    session.endSession();
  }

  booking = await Booking.findById(booking._id).populate('user').populate('event');
  await invalidateEventCaches(booking.event._id);
  await emailService.sendBookingConfirmation({
    user: booking.user,
    event: booking.event,
    booking
  });
  getIo()?.to(`event:${booking.event._id}`).emit('availability-updated', {
    eventId: booking.event._id,
    availableSeats: booking.event.availableSeats
  });
  res.json({ success: true, data: { booking } });
});

export const paymentWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.rawBody || JSON.stringify(req.body);
  if (!verifyWebhookSignature(rawBody, signature)) throw new ApiError(400, 'Invalid webhook signature');

  const eventType = req.body.event;
  const entity = req.body.payload?.payment?.entity;

  if (eventType === 'payment.failed' && entity?.order_id) {
    await Payment.findOneAndUpdate(
      { razorpayOrderId: entity.order_id },
      { paymentStatus: 'failed', failureReason: entity.error_description || 'Payment failed' }
    );
  }

  if (eventType === 'payment.captured' && entity?.order_id) {
    // Fallback path: confirms the booking server-side in case the client
    // never called /verify (tab closed, network drop, app crash after payment).
    // Safe to run even if /verify already handled it — confirmBookingFromPayment
    // no-ops on already-paid payments.
    const session = await mongoose.startSession();
    try {
      const booking = await confirmBookingFromPayment({
        session,
        razorpayOrderId: entity.order_id,
        razorpayPaymentId: entity.id,
        razorpaySignature: null // no client signature available on webhook path
      });

      if (booking) {
        const populated = await Booking.findById(booking._id).populate('user').populate('event');
        await invalidateEventCaches(populated.event._id);
        await emailService.sendBookingConfirmation({
          user: populated.user,
          event: populated.event,
          booking: populated
        });
        getIo()?.to(`event:${populated.event._id}`).emit('availability-updated', {
          eventId: populated.event._id,
          availableSeats: populated.event.availableSeats
        });
      }
    } catch (error) {
      // Log but still return 200 — Razorpay retries on non-2xx, and if this
      // failed due to sold-out seats there's nothing a retry can fix.
      console.error('Webhook booking confirmation failed', {
        orderId: entity.order_id,
        message: error?.message
      });
    } finally {
      session.endSession();
    }
  }

  res.json({ success: true });
});

export const refundPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) throw new ApiError(404, 'Payment not found');
  payment.paymentStatus = 'refunded';
  await payment.save();
  await Booking.findByIdAndUpdate(payment.booking, { bookingStatus: 'refunded' });
  res.json({ success: true, data: { payment } });
});