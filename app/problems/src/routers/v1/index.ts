import { Router } from "express";
import problemsRouter from "./problems-routes";


const router = Router();
router.use('/', problemsRouter);

export default router;