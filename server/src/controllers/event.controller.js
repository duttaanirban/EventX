import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getIo } from '../socket/index.js';

const canManageEvent = (user, event) =>
  user.role === 'admin' || String(event.organizer) === String(user._id);

export const listEvents = asyncHandler(async (req, res) => {
  const { search, category, city, minPrice, maxPrice, sort, page, limit } = req.validated.query;
  const query = {};
  if (search) query.$text = { $search: search };
  if (category) query.category = category;
  if (city) query.city = new RegExp(city, 'i');
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.ticketPrice = {};
    if (minPrice !== undefined) query.ticketPrice.$gte = minPrice;
    if (maxPrice !== undefined) query.ticketPrice.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;
  const [events, total] = await Promise.all([
    Event.find(query)
      .populate('organizer', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Event.countDocuments(query)
  ]);

  res.json({ success: true, data: { events, page, pages: Math.ceil(total / limit), total } });
});

export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name avatar email');
  if (!event) throw new ApiError(404, 'Event not found');
  res.json({ success: true, data: { event } });
});

export const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({
    ...req.body,
    organizer: req.user._id,
    availableSeats: req.body.totalSeats
  });
  res.status(201).json({ success: true, data: { event } });
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  if (!canManageEvent(req.user, event)) throw new ApiError(403, 'Cannot manage this event');

  const sold = event.totalSeats - event.availableSeats;
  Object.assign(event, req.body);
  event.availableSeats = Math.max(req.body.totalSeats - sold, 0);
  await event.save();
  getIo()?.to(`event:${event._id}`).emit('event-updated', event);
  res.json({ success: true, data: { event } });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw new ApiError(404, 'Event not found');
  if (!canManageEvent(req.user, event)) throw new ApiError(403, 'Cannot manage this event');
  const bookings = await Booking.countDocuments({ event: event._id, bookingStatus: 'confirmed' });
  if (bookings > 0) throw new ApiError(409, 'Cannot delete event with confirmed bookings');
  await event.deleteOne();
  res.json({ success: true, message: 'Event deleted' });
});

export const myOrganizerEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: { events } });
});
