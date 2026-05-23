import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../config/env.js';

export const razorpay = new Razorpay({
  key_id: env.razorpayKeyId,
  key_secret: env.razorpayKeySecret
});

export const createRazorpayOrder = ({ amount, receipt }) =>
  razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt,
    payment_capture: 1
  });

export const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
  const expected = crypto
    .createHmac('sha256', env.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};

export const verifyWebhookSignature = (body, signature) => {
  const expected = crypto.createHmac('sha256', env.razorpayWebhookSecret).update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};
