import { Router } from "express";
import { contestControllers } from "../../controllers";
const router = Router();

router.post('contest', contestControllers.createContest);

export default router;