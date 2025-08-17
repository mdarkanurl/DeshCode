import { Router } from "express";
import { discussionsControllers } from "../../controllers";
const router = Router();

router.post('/', discussionsControllers.createDiscussions);
router.get('/', discussionsControllers.getAllDiscussions);
router.get('/:id', discussionsControllers.getDiscussionsById);
router.patch('/:id', discussionsControllers.updateDiscussions);

export default router