import { Router } from "express";
import discussRouter from "./discuss-route";
import commentRouter from "./comment-route";


const router = Router();
router.use('/', discussRouter);
router.use('/', commentRouter);

export default router;