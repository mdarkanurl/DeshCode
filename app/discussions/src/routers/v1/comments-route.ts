import { Router } from "express";
import { commentsControllers } from "../../controllers";
const router = Router();

router.post('/', commentsControllers.createComments);
router.get('/', commentsControllers.getAllComments);

export default router