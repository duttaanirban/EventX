import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createBookingIntent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.body.eventId);
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.availableSeats < req.body.ticketCount) throw new ApiError(409, 'Not enough seats available');
  res.status(202).json({
    success: true,
    message: 'Booking intent accepted. Create a payment order to continue.',
    data: { eventId: event._id, ticketCount: req.body.ticketCount, amount: event.ticketPrice * req.body.ticketCount }
  });
});

export const myBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('event')
    .populate('paymentId')
    .sort('-createdAt');
  res.json({ success: true, data: { bookings } });
});

export const eventBookings = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  if (req.user.role !== 'admin' && String(event.organizer) !== String(req.user._id)) {
    throw new ApiError(403, 'Cannot view attendees for this event');
  }
  const bookings = await Booking.find({ event: event._id })
    .populate('user', 'name email avatar')
    .sort('-createdAt');
  res.json({ success: true, data: { bookings } });
});
