import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = env.smtpHost
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: { user: env.smtpUser, pass: env.smtpPass }
    })
  : null;

const send = async ({ to, subject, html, attachments = [] }) => {
  if (!transporter) {
    console.log(`Email skipped in development: ${subject} -> ${to}`);
    return;
  }
  await transporter.sendMail({ from: env.mailFrom, to, subject, html, attachments });
};

export const emailService = {
  sendWelcome: (user) =>
    send({
      to: user.email,
      subject: 'Welcome to EventX',
      html: `<div style="font-family:Inter,Arial"><h2>Welcome, ${user.name}</h2><p>Your EventX account is ready. Discover premium events and manage your tickets securely.</p></div>`
    }),

  sendPasswordReset: (user, url) =>
    send({
      to: user.email,
      subject: 'Reset your EventX password',
      html: `<div style="font-family:Inter,Arial"><h2>Password reset</h2><p>Use this secure link within 15 minutes:</p><p><a href="${url}">${url}</a></p></div>`
    }),

  sendBookingConfirmation: ({ user, event, booking }) =>
    send({
      to: user.email,
      subject: `Your ticket for ${event.title}`,
      html: `<div style="font-family:Inter,Arial"><h2>${event.title}</h2><p>${event.venue}, ${event.city}</p><p>Tickets: ${booking.ticketCount}</p><p>Show the attached QR code at check-in.</p></div>`,
      attachments: [
        {
          filename: `eventx-ticket-${booking._id}.png`,
          content: booking.qrCode.split('base64,')[1],
          encoding: 'base64'
        }
      ]
    })
};
