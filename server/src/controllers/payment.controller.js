import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createQrPayload, generateQrDataUrl } from '../utils/qr.js';
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature
} from '../services/payment.service.js';
import { emailService } from '../services/email.service.js';
import { getIo } from '../socket/index.js';
import { env } from '../config/env.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { eventId, ticketCount } = req.body;
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.availableSeats < ticketCount) throw new ApiError(409, 'Not enough seats available');

  const amount = event.ticketPrice * ticketCount;
  const order = await createRazorpayOrder({
    amount,
    receipt: `eventx_${event._id}_${Date.now()}`
  });

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
  await session.withTransaction(async () => {
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id }).session(session);
    if (!payment) throw new ApiError(404, 'Payment order not found');
    if (payment.paymentStatus === 'paid') throw new ApiError(409, 'Payment already verified');

    const event = await Event.findById(payment.event).session(session);
    if (!event || event.availableSeats < payment.ticketCount) {
      throw new ApiError(409, 'Seats are no longer available');
    }

    event.availableSeats -= payment.ticketCount;
    event.attendees.addToSet(payment.user);
    await event.save({ session });

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
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.booking = booking._id;
    await payment.save({ session });

    booking.paymentId = payment._id;
    await booking.save({ session });
  });
  session.endSession();

  booking = await Booking.findById(booking._id).populate('user').populate('event');
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

  const event = req.body.event;
  const entity = req.body.payload?.payment?.entity;
  if (event === 'payment.failed' && entity?.order_id) {
    await Payment.findOneAndUpdate(
      { razorpayOrderId: entity.order_id },
      { paymentStatus: 'failed', failureReason: entity.error_description || 'Payment failed' }
    );
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
