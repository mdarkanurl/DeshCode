import { Router } from "express";
import { contestControllers } from "../../controllers";
const router = Router();

router.post('contests', contestControllers.createContest);
router.get('contests/:id', contestControllers.getContestById);
router.get('contests', contestControllers.getAllContest);

export default router;