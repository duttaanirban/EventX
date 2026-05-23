import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

export const signAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtAccessSecret, { expiresIn: '15m' });

export const signRefreshToken = (user) =>
  jwt.sign({ id: user._id, tokenVersion: user.tokenVersion }, env.jwtRefreshSecret, {
    expiresIn: '7d'
  });

export const signResetToken = (user) =>
  jwt.sign({ id: user._id }, env.jwtResetSecret, { expiresIn: '15m' });

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};
