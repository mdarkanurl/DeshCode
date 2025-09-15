import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from 'passport';
import { prisma } from '../prisma';
import dotenv from "dotenv";
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '646447908070-r6gafdu2.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOCSPX-A4vhNGzptaSAk4A',
    callbackURL: process.env.GOOGLE_CALL_BACK_URL || 'http://localhost:3004/api/v1/oauth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile?.emails?.[0]?.value as string;
      const googleId = profile.id;

      // Find user by email
      let user = await prisma.google_OAuth.findUnique({
        where: {
            email: email
        }
      });

      // If user does not exist, create one
      if (!user) {
        user = await prisma.google_OAuth.create({
            data: {
                email: email,
                googleId,
                name: profile.displayName,
                provider: 'google',
                isVerified: true
            }
        });
      }

      // Pass users to next step
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
));

export {
  passport
};