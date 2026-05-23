import express from 'express';
import {
  adminAnalytics,
  listPayments,
  listUsers,
  organizerAnalytics,
  updateUserStatus
} from '../controllers/analytics.controller.js';
import { authorize, protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/organizer', protect, authorize('organizer', 'admin'), organizerAnalytics);
router.get('/admin', protect, authorize('admin'), adminAnalytics);
router.get('/admin/users', protect, authorize('admin'), listUsers);
router.patch('/admin/users/:id', protect, authorize('admin'), updateUserStatus);
router.get('/admin/payments', protect, authorize('admin'), listPayments);

export default router;
