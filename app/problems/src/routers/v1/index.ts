import { Router } from "express";
import problemsRouter from "./problems-routes";
import submissionsRouter from "./submissions-route";


const router = Router();
router.use('/problems', problemsRouter);
router.use('/submissions', submissionsRouter);

export default router;