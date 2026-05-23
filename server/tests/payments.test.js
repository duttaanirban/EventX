import crypto from 'crypto';
import { verifyPaymentSignature } from '../src/services/payment.service.js';

describe('Payment service', () => {
  it('verifies Razorpay signatures', () => {
    process.env.RAZORPAY_KEY_SECRET = 'rzp_secret';
    const orderId = 'order_123';
    const paymentId = 'pay_123';
    const signature = crypto.createHmac('sha256', 'rzp_secret').update(`${orderId}|${paymentId}`).digest('hex');
    expect(verifyPaymentSignature({ orderId, paymentId, signature })).toBe(true);
  });
});
