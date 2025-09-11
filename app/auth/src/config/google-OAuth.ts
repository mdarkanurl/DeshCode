import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from 'passport';
import { prisma } from '../prisma';
import dotenv from "dotenv";
dotenv.config({ path: '../../.env' });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '646447908070-r6gafdu2.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOCSPX-A4vhNGzptaSAk4A',
    callbackURL: "http://localhost:3004/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile?.emails?.[0]?.value as string;
      const googleId = profile.id;

      // Find user by email
      let users = await prisma.google_OAuth.findUnique({
        where: {
            email: email
        }
      });

      // If user does not exist, create one
      if (!users) {
        users = await prisma.google_OAuth.create({
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
      return done(null, users ?? false);
    } catch (err) {
      return done(err, false);
    }
  }
));

export {
    passport
}