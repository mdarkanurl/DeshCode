import { Router } from "express";
import contestRouter from "./contest-route";
import participantRouter from "./contest-route";

const router = Router();

router.use('/', contestRouter);
router.use('/', participantRouter);

export default router;