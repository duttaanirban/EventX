import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export const configurePassport = () => {
  if (!env.googleClientId || !env.googleClientSecret) return;

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.googleClientId,
        clientSecret: env.googleClientSecret,
        callbackURL: '/api/auth/google/callback'
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) throw new ApiError(400, 'Google account has no email');
          const user = await User.findOneAndUpdate(
            { email },
            {
              name: profile.displayName,
              email,
              avatar: profile.photos?.[0]?.value,
              isVerified: true,
              provider: 'google'
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
          );
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
