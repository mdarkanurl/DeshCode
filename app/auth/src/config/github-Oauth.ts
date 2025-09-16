import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import { prisma } from "../prisma";
import dotenv from 'dotenv';
import { Provider } from "@prisma/client";
import axios from "axios";
dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALL_BACK_URL || "http://localhost:3004/api/v1/oauth/github/callback",
    },
    async (
      accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: (error: any, user?: Express.User | false | null) => void
    ) => {
      try {
        // Try to get email from profile
        let email = profile?.emails?.[0]?.value;

        // If email not returned, fetch from GitHub API
        if (!email) {
          const { data: emails } = await axios.get("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${accessToken}`,
              Accept: "application/vnd.github+json",
            },
          });

          // Look for primary & verified email
          const primaryEmail = emails.find((e: any) => e.primary && e.verified);
          email = primaryEmail?.email || emails[0]?.email;
        }

        if (!email) {
          throw new Error("No email found from GitHub. Please make sure your email is public or verified.");
        }

        let user;
        user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName || null,
              avatar: profile.photos?.[0]?.value || null,
              isVerified: true
            },
          });

          await prisma.authProvider.create({
            data: {
              provider: "github",
              providerId: profile.id,
              email,
              username: profile.username || null,
              avatar: profile.photos?.[0]?.value || null,
              userId: user.id
            }
          });
        } else {
          const IsProviderGoogle = await prisma.authProvider.count({
            where: {
              userId: user.id,
              provider: Provider.github
            }
          });
          
          if(IsProviderGoogle <= 0) {
            await prisma.authProvider.create({
              data: {
                provider: Provider.github,
                providerId: profile.id,
                email,
                username: profile.username ?? null,
                avatar: profile.photos?.[0]?.value ?? null,
                userId: user.id
              }
            });
            await prisma.user.update({
              where: { id: user.id },
              data: {
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value ?? null,
              }
            });
          }
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