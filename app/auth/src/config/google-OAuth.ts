import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from 'passport';
import { prisma } from '../prisma';
import { Provider } from "@prisma/client";
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

      // Find user by email
      let user = await prisma.user.findUnique({
        where: {
            email: email
        }
      });

      // If user does not exist, create one
      if (!user) {
        user = await prisma.user.create({
            data: {
                email: email,
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value ?? null,
                isVerified: true
            }
        });

        await prisma.authProvider.create({
          data: {
            provider: Provider.google,
            providerId: profile.id,
            email: email,
            username: profile.username ?? null,
            avatar: profile.photos?.[0]?.value ?? null,
            userId: user.id
          }
        });
      } else { // If Google provider does not exist, create one
        const IsProviderGoogle = await prisma.authProvider.count({
          where: {
            userId: user.id,
            provider: Provider.google
          }
        });

        if(IsProviderGoogle <= 0) {
          await prisma.authProvider.create({
            data: {
              provider: Provider.google,
              providerId: profile.id,
              email: email,
              username: profile.username ?? null,
              avatar: profile.photos?.[0]?.value ?? null,
              userId: user.id
            }
          });
        }
      }

      // Pass user to next step
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }
));

export {
  passport
};