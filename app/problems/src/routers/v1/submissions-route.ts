import { Router } from "express";
import { submissionsControllers } from "../../controllers";
const router = Router();

import { authMiddlewares } from "../../middlewares";
const { islogin } = authMiddlewares;

router.post('/', islogin, submissionsControllers.submissionsSolution);
router.get('/:id', islogin, submissionsControllers.getSubmissionsById);

export default router;