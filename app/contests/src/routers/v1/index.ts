import { Router } from "express";
import contestRouter from "./contest-route";
import participantRouter from "./participant-route";
import submissionRouter from "./submission-route";

const router = Router();

router.use('/contests', contestRouter);
router.use('/participants', participantRouter);
router.use('/submissions/contests', submissionRouter);

export default router;