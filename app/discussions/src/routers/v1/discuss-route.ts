import { Router } from "express";
import { discussControllers } from "../../controllers";
const router = Router();

router.post('/discuss', discussControllers.createDiscuss);
router.get('/discuss', discussControllers.getAllDiscuss);
router.get('/discuss/:id', discussControllers.getDiscussById);
router.patch('/discuss/:id', discussControllers.updateDiscuss);

export default router