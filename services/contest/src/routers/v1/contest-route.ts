import { Router } from "express";
import { contestControllers } from "../../controllers";
const router = Router();

router.post('contest', contestControllers.createContest);
router.get('contest/:id', contestControllers.getContestById);
router.get('contest', contestControllers.getAllContest);

export default router;