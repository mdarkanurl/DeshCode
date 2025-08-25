import { Router } from "express";
import { submissionsControllers } from "../../controllers";
const router = Router();

router.post('/', submissionsControllers.submitSolution);
router.get('/:id', submissionsControllers.getSubmission);

export default router;