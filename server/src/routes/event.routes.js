import express from 'express';
import {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  myOrganizerEvents,
  updateEvent
} from '../controllers/event.controller.js';
import { authorize, protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { eventQuerySchema, eventWriteSchema } from '../validators/event.validator.js';

const router = express.Router();

router.get('/', validate(eventQuerySchema), listEvents);
router.get('/mine', protect, authorize('organizer', 'admin'), myOrganizerEvents);
router.get('/:id', getEvent);
router.post('/', protect, authorize('organizer', 'admin'), validate(eventWriteSchema), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), validate(eventWriteSchema), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

export default router;
