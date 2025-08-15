import { Router } from "express";
import { submitControllers } from "../../controllers";
const router = Router();

router.post('/', submitControllers.submitSolution);

export default router;