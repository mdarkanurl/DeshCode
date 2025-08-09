import { Router } from "express";
import { submitControllers } from "../../controllers";
const router = Router();

router.get('/submit/contest', submitControllers.submitSolution);

export default router;