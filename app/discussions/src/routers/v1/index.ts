import { Router } from "express";
import discussionsRouter from "./discussions-route";
import commentsRouter from "./comments-route";


const router = Router();
router.use('/discussions', discussionsRouter);
router.use('/comments', commentsRouter);

export default router;