import crypto from 'crypto';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getIo } from '../socket/index.js';
import {
  cacheEventAvailability,
  cacheEventDetail,
  cacheEventList,
  eventAvailabilityKey,
  eventDetailKey,
  eventListKey,
  getCachedEventAvailability,
  getCachedEventDetail,
  getCachedEventList,
  getEventListVersion,
  invalidateEventCaches
} from '../services/cache.service.js';

const canManageEvent = (user, event) =>
  user.role === 'admin' || String(event.organizer) === String(user._id);

export const listEvents = asyncHandler(async (req, res) => {
  const { search, category, city, minPrice, maxPrice, sort, page, limit } = req.validated.query;
  const cacheQuery = { search, category, city, minPrice, maxPrice, sort, page, limit };
  const queryKey = crypto.createHash('sha1').update(JSON.stringify(cacheQuery)).digest('hex');
  const version = await getEventListVersion();
  const cached = await getCachedEventList(eventListKey(version, queryKey));
  if (cached) {
    res.json({ success: true, data: cached });
    return;
  }

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

  const data = { events, page, pages: Math.ceil(total / limit), total };
  await cacheEventList(eventListKey(version, queryKey), data);
  res.json({ success: true, data });
});

export const getEvent = asyncHandler(async (req, res) => {
  const detailKey = eventDetailKey(req.params.id);
  const cachedEvent = await getCachedEventDetail(detailKey);
  if (cachedEvent) {
    const availability = await getCachedEventAvailability(eventAvailabilityKey(req.params.id));
    if (availability) cachedEvent.availableSeats = availability.availableSeats;
    res.json({ success: true, data: { event: cachedEvent } });
    return;
  }

  const event = await Event.findById(req.params.id).populate('organizer', 'name avatar email');
  if (!event) throw new ApiError(404, 'Event not found');
  const data = event.toObject();
  await Promise.all([
    cacheEventDetail(detailKey, data),
    cacheEventAvailability(eventAvailabilityKey(event._id), { availableSeats: event.availableSeats })
  ]);
  res.json({ success: true, data: { event: data } });
});

export const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({
    ...req.body,
    organizer: req.user._id,
    availableSeats: req.body.totalSeats
  });
  await invalidateEventCaches(event._id);
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
  await invalidateEventCaches(event._id);
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
  await invalidateEventCaches(event._id);
  res.json({ success: true, message: 'Event deleted' });
});

export const myOrganizerEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).sort('-createdAt');
  res.json({ success: true, data: { events } });
});
