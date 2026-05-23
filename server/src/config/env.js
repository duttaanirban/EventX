import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/eventx',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  jwtResetSecret: process.env.JWT_RESET_SECRET || 'dev-reset-secret',
  cookieSecret: process.env.COOKIE_SECRET || 'dev-cookie-secret',
  qrSecret: process.env.QR_SECRET || 'dev-qr-secret',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret',
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook-secret',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  mailFrom: process.env.MAIL_FROM || 'EventX <tickets@eventx.app>',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET
};
