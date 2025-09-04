import { Router } from "express";
import leaderboardRoutes from "./leaderboards-route";
const router = Router();

router.use('/leaderboards', leaderboardRoutes);

export default router;