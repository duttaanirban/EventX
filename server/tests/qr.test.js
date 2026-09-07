import { createQrPayload, generateQrDataUrl, verifyQrPayload } from '../src/utils/qr.js';

describe('QR ticket utilities', () => {
  const bookingId = '507f1f77bcf86cd799439011';
  const eventId = '507f1f77bcf86cd799439012';

  it('generates a payload and QR image that validate together', async () => {
    const payload = createQrPayload({ bookingId, eventId });
    const dataUrl = await generateQrDataUrl(payload);

    expect(verifyQrPayload(payload)).toBe(true);
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });

  it('rejects a token generated for a different booking', () => {
    const payload = createQrPayload({ bookingId, eventId });
    const tampered = { ...payload, bookingId: '507f1f77bcf86cd799439013' };

    expect(verifyQrPayload(tampered)).toBe(false);
  });
});
