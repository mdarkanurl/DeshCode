import { Router } from "express";
import passport from "passport";
import { OauthControllers } from "../../controllers";
const { googleCallback } = OauthControllers;

const router = Router();

router.post('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallback
);

export default router;