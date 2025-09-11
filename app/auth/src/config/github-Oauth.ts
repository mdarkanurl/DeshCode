import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import { prisma } from "../prisma";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: (error: any, user?: Express.User | false | null) => void
    ) => {
      try {
        let user = await prisma.gitHub_OAuth.findUnique({
          where: { githubId: profile.id },
        });

        if (!user) {
          user = await prisma.gitHub_OAuth.create({
            data: {
              githubId: profile.id,
              username: profile.username || "",
              email: profile.emails?.[0]?.value || null,
              avatar: profile.photos?.[0]?.value || null,
            },
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);