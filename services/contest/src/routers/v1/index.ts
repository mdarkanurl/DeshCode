import { Router } from "express";
import contestRouter from "./contest-route";


const router = Router();
router.use('/', contestRouter);

export default router;