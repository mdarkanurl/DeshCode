import { Router } from "express";
import contestRouter from "./contest-route";
import participantRouter from "./participant-route";
import submitRouter from "./submit-route";

const router = Router();

router.use('/contests', contestRouter);
router.use('/participants', participantRouter);
router.use('/submits/contests', submitRouter);

export default router;