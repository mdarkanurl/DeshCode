import { Router } from "express";
import { contestControllers } from "../../controllers";
const router = Router();

router.post('contest', contestControllers.createContest);
router.get('contest/:id', contestControllers.getContestById);

export default router;