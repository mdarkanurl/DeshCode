import { Router } from "express";
import { submissionsControllers } from "../../controllers";
const router = Router();

router.post('/', submissionsControllers.submitSolution);

export default router;