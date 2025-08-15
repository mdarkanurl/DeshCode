import { Router } from "express";
import { contestControllers } from "../../controllers";
const router = Router();

router.post('/', contestControllers.createContest);
router.get('/:id', contestControllers.getContestById);
router.get('/', contestControllers.getAllContest);

export default router;