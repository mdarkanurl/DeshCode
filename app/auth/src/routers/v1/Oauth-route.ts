import { Router } from "express";
import passport from "passport";
import { OauthControllers } from "../../controllers";
const { googleCallback, githubCallback } = OauthControllers;

const router = Router();

router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallback
);

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
    "/github/callback",
    passport.authenticate("github", { session: false, failureRedirect: "/login" }),
    githubCallback
);

export default router;