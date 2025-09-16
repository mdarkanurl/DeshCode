import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import { prisma } from "../prisma";
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALL_BACK_URL || "http://localhost:3004/api/v1/oauth/github/callback",
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: (error: any, user?: Express.User | false | null) => void
    ) => {
      try {
        let user;
        user = await prisma.authProvider.findUnique({
          where: { providerId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0]?.value || null,
              name: profile.displayName || null,
              avatar: profile.photos?.[0]?.value || null,
              isVerified: true
            },
          });

          await prisma.authProvider.create({
            data: {
              provider: "github",
              providerId: profile.id,
              email: profile.emails?.[0]?.value || null,
              username: profile.username || null,
              avatar: profile.photos?.[0]?.value || null,
              userId: user.id
            }
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export {
  passport
};