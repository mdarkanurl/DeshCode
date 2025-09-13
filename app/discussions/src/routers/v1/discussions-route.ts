import { Router } from "express";
import { discussionsControllers } from "../../controllers";
const router = Router();

import { authMiddlewares } from "../../middlewares";
const { islogin } = authMiddlewares;

router.post('/', islogin, discussionsControllers.createDiscussions);
router.get('/', discussionsControllers.getAllDiscussions);
router.get('/:id', discussionsControllers.getDiscussionsById);
router.put('/:id', islogin, discussionsControllers.updateDiscussions);

export default router