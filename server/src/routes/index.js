import express from 'express';
import authRoutes from './auth.routes.js';
import eventRoutes from './event.routes.js';
import bookingRoutes from './booking.routes.js';
import paymentRoutes from './payment.routes.js';
import qrRoutes from './qr.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/qr', qrRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
