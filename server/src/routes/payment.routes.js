import express from 'express';
import { createOrder, paymentWebhook, refundPayment, verifyPayment } from '../controllers/payment.controller.js';
import { authorize, protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createOrderSchema, verifyPaymentSchema } from '../validators/payment.validator.js';

const router = express.Router();

router.post('/create-order', protect, validate(createOrderSchema), createOrder);
router.post('/verify', protect, validate(verifyPaymentSchema), verifyPayment);
router.post('/webhook', paymentWebhook);
router.post('/:id/refund', protect, authorize('admin'), refundPayment);

export default router;
