import { Router } from "express";
import { leaderboardControllers } from "../../controllers";
const router = Router();

router.get("/:contestId", leaderboardControllers.getLeaderboardResultsByContestId);

export default router;