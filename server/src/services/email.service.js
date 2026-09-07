import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const request = globalThis.fetch;
const RESEND_EMAIL_URL = 'https://api.resend.com/emails';
const isSmtpConfigured = Boolean(env.smtpHost && env.smtpUser && env.smtpPass);
const shouldUseResend = env.nodeEnv !== 'test' && Boolean(env.resendApiKey);
const shouldUseSmtp = env.nodeEnv !== 'test' && !shouldUseResend && isSmtpConfigured;

const transporter = shouldUseSmtp
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: { user: env.smtpUser, pass: env.smtpPass },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000
    })
  : null;

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatEventDate = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeZone: 'Asia/Kolkata'
  }).format(new Date(date));

const layout = ({ title, preview, body }) => `
  <div style="margin:0;background:#f8fafc;padding:24px;font-family:Inter,Arial,sans-serif;color:#0f172a">
    <div style="margin:0 auto;max-width:560px;border-radius:12px;background:#ffffff;padding:28px;border:1px solid #e2e8f0">
      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#2563eb">EventX</p>
      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25">${title}</h1>
      <p style="margin:0 0 24px;color:#475569">${preview}</p>
      ${body}
      <p style="margin:28px 0 0;font-size:12px;color:#64748b">This is an automated notification from EventX.</p>
    </div>
  </div>
`;

const sendWithResend = async ({ to, subject, html, attachments }) => {
  const response = await request(RESEND_EMAIL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: env.mailFrom,
      to: [to],
      subject,
      html,
      attachments: attachments.map(({ filename, content }) => ({ filename, content }))
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.message || data?.error?.message || `Resend API failed with ${response.status}`);
  }
  return data;
};

const send = async ({ to, subject, html, attachments = [], required = false }) => {
  if (!shouldUseResend && !transporter) {
    if (env.nodeEnv !== 'test') {
      console.log(`Email skipped: no email provider is configured. ${subject} -> ${to}`);
    }
    return;
  }

  try {
    if (shouldUseResend) {
      await sendWithResend({ to, subject, html, attachments });
    } else {
      await transporter.sendMail({ from: env.mailFrom, to, subject, html, attachments });
    }
  } catch (error) {
    console.error('Email delivery failed', {
      to,
      subject,
      message: error.message
    });
    if (required) throw error;
  }
};

export const emailService = {
  sendWelcome: (user) =>
    send({
      to: user.email,
      subject: 'Welcome to EventX',
      html: layout({
        title: `Welcome, ${escapeHtml(user.name)}`,
        preview: 'Your EventX account is ready.',
        body: '<p style="margin:0;color:#334155">Discover events, book tickets, and keep your QR passes handy from your dashboard.</p>'
      })
    }),

  sendPasswordReset: (user, url) =>
    send({
      to: user.email,
      subject: 'Reset your EventX password',
      required: true,
      html: layout({
        title: 'Reset your password',
        preview: 'Use this secure link within 15 minutes.',
        body: `
          <p style="margin:0 0 20px;color:#334155">We received a request to reset the password for ${escapeHtml(user.email)}.</p>
          <a href="${escapeHtml(url)}" style="display:inline-block;border-radius:8px;background:#2563eb;color:#ffffff;padding:12px 16px;text-decoration:none;font-weight:700">Reset password</a>
          <p style="margin:20px 0 0;font-size:13px;color:#64748b">If the button does not work, open this link: ${escapeHtml(url)}</p>
        `
      })
    }),

  sendBookingConfirmation: ({ user, event, booking }) => {
    const qrContent = booking.qrCode?.includes('base64,') ? booking.qrCode.split('base64,')[1] : null;
    return send({
      to: user.email,
      subject: `Your ticket for ${event.title}`,
      html: layout({
        title: `Ticket confirmed: ${escapeHtml(event.title)}`,
        preview: 'Your booking is confirmed. Show the attached QR code at check-in.',
        body: `
          <div style="border-radius:10px;background:#f8fafc;padding:16px;border:1px solid #e2e8f0">
            <p style="margin:0 0 8px"><strong>Venue:</strong> ${escapeHtml(event.venue)}, ${escapeHtml(event.city)}</p>
            <p style="margin:0 0 8px"><strong>Date:</strong> ${formatEventDate(event.date)}</p>
            <p style="margin:0 0 8px"><strong>Time:</strong> ${escapeHtml(event.time)}</p>
            <p style="margin:0"><strong>Tickets:</strong> ${booking.ticketCount}</p>
          </div>
          <p style="margin:20px 0 0;color:#334155">Keep the QR attachment accessible on your phone for entry.</p>
        `
      }),
      attachments: qrContent
        ? [
            {
              filename: `eventx-ticket-${booking._id}.png`,
              content: qrContent,
              encoding: 'base64'
            }
          ]
        : []
    });
  }
};
