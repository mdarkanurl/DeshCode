import { Router } from "express";
import { discussControllers } from "../../controllers";
const router = Router();

router.post('/discuss', discussControllers.createDiscuss);
router.get('/discuss', discussControllers.getAllDiscuss);

export default router