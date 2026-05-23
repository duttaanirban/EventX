import express from 'express';
import { createBookingIntent, eventBookings, myBookings } from '../controllers/booking.controller.js';
import { protect, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { bookingIntentSchema } from '../validators/booking.validator.js';

const router = express.Router();

router.post('/', protect, validate(bookingIntentSchema), createBookingIntent);
router.get('/user', protect, myBookings);
router.get('/event/:id', protect, authorize('organizer', 'admin'), eventBookings);

export default router;
