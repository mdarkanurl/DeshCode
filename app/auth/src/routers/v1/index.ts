import { Router } from "express";
import authRouter from './auth-route';
import Oauth from './Oauth-route';
const router = Router();

router.use('/auth', authRouter);
router.use('/oauth', Oauth);

export default router;