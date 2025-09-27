import { Router } from "express";
import { submissionsControllers } from "../../controllers";
import { submissionMiddlewares, authMiddlewares } from "../../middlewares";
const router = Router();

const { islogin } = authMiddlewares;

router.post('/:contestId',
    islogin,
    submissionMiddlewares.CheckIsSubmissionAllow,
    submissionsControllers.submitSolution
);

router.get('/:id', islogin, submissionsControllers.getSubmission);

export default router;