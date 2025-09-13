import { Router } from "express";
import { commentsControllers } from "../../controllers";
const router = Router();

import { authMiddlewares } from "../../middlewares";
const { islogin } = authMiddlewares;

router.post('/', islogin, commentsControllers.createComments);
router.get('/', commentsControllers.getAllComments);

export default router