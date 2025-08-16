import { Router } from "express";
import { submissionsControllers } from "../../controllers";
const router = Router();

router.post('/', submissionsControllers.submissionsSolution);
router.get('/:id', submissionsControllers.getSubmissionsById);

export default router;