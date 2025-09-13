import { Router } from "express";
import { submissionsControllers } from "../../controllers";
import { submissionMiddlewares, authMiddlewares } from "../../middlewares";
const router = Router();

const { isAdmin, islogin } = authMiddlewares;

router.post('/',
    islogin,
    submissionMiddlewares.CheckIsSubmissionAllow,
    submissionsControllers.submitSolution
);

router.get('/:id', islogin, submissionsControllers.getSubmission);

export default router;