import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyQrPayload } from '../utils/qr.js';
import { getIo } from '../socket/index.js';

export const validateQr = asyncHandler(async (req, res) => {
  const payload = typeof req.body.payload === 'string' ? JSON.parse(req.body.payload) : req.body.payload;
  if (!payload?.bookingId || !payload?.eventId || !payload?.token) throw new ApiError(400, 'Invalid QR payload');
  if (!verifyQrPayload(payload)) throw new ApiError(400, 'QR validation failed');

  const booking = await Booking.findById(payload.bookingId).populate('user', 'name email').populate('event');
  if (!booking || String(booking.event._id) !== String(payload.eventId)) throw new ApiError(404, 'Booking not found');
  const event = await Event.findById(booking.event._id);
  if (req.user.role !== 'admin' && String(event.organizer) !== String(req.user._id)) {
    throw new ApiError(403, 'Cannot check in attendees for this event');
  }
  if (booking.checkedIn) throw new ApiError(409, 'Ticket already checked in');

  booking.checkedIn = true;
  booking.checkedInAt = new Date();
  await booking.save();
  getIo()?.to(`event:${event._id}`).emit('checkin-updated', { eventId: event._id, bookingId: booking._id });
  res.json({ success: true, data: { booking } });
});
