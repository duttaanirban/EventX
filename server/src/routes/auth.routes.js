import express from 'express';
import passport from 'passport';
import {
  forgotPassword,
  googleCallback,
  login,
  logout,
  me,
  refresh,
  register,
  resetPassword
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema
} from '../validators/auth.validator.js';
import { env } from '../config/env.js';
import { isGoogleOAuthConfigured } from '../config/passport.js';

const router = express.Router();
const requireGoogleOAuth = (_req, res, next) => {
  if (!isGoogleOAuthConfigured) {
    res.status(503).json({ success: false, message: 'Google OAuth is not configured on the server' });
    return;
  }
  next();
};

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.get('/me', protect, me);
router.get('/google', requireGoogleOAuth, passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
  '/google/callback',
  requireGoogleOAuth,
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${env.clientUrl}/login?oauth=failed`
  }),
  googleCallback
);

export default router;
