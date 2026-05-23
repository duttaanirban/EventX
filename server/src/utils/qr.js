import crypto from 'crypto';
import QRCode from 'qrcode';
import { env } from '../config/env.js';

export const createQrPayload = ({ bookingId, eventId }) => {
  const data = `${bookingId}.${eventId}`;
  const token = crypto.createHmac('sha256', env.qrSecret).update(data).digest('hex');
  return { bookingId, eventId, token };
};

export const verifyQrPayload = ({ bookingId, eventId, token }) => {
  const expected = createQrPayload({ bookingId, eventId }).token;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
};

export const generateQrDataUrl = (payload) =>
  QRCode.toDataURL(JSON.stringify(payload), { errorCorrectionLevel: 'H', margin: 2, width: 520 });
