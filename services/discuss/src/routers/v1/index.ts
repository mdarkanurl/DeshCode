import { Router } from "express";
import discussRouter from "./discuss-route";


const router = Router();
router.use('/', discussRouter);

export default router;