import { Router } from "express";
import contestRouter from "./contest-route";
import participantRouter from "./contest-route";
import submitRouter from "./submit-route";

const router = Router();

router.use('/', contestRouter);
router.use('/', participantRouter);
router.use('/', submitRouter);

export default router;