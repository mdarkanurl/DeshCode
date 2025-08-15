import { Router } from "express";
import { commentControllers } from "../../controllers";
const router = Router();

router.post('/comments', commentControllers.createComment);
router.get('/comments', commentControllers.getAllComments);

export default router