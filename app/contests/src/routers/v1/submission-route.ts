import { Router } from "express";
import { submissionsControllers } from "../../controllers";
import { submissionMiddlewares } from "../../middlewares";
const router = Router();

router.post('/',
    submissionMiddlewares.CheckIsSubmissionAllow,
    submissionsControllers.submitSolution
);

router.get('/:id', submissionsControllers.getSubmission);

export default router;