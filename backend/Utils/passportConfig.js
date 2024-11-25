import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../Database Schema/User.js';

dotenv.config({ path: '../.env' });

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_TIME = process.env.JWT_EXPIRES_TIME;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('Google Profile:', profile);
      console.log('id', profile.provider)
      try {

        let user = await User.findOne({ email: profile.emails[0].value, provider: profile.provider });
        if (user) {
          const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_TIME });
          done(null, {user, token});
          return;
        }

        user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
            provider: profile.provider,
            providerId: profile.id,
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_TIME });
        done(null, {user, token});
      }catch (error) {
        console.error('Error when saving user to db in google strategy:', error.message);
        done(error, null);
      }
    }
  )
);

export default passport;
