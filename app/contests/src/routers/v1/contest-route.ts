import { Router } from "express";
import { contestsControllers } from "../../controllers";
const router = Router();

router.post('/', contestsControllers.createContests);
router.get('/:id', contestsControllers.getContestsById);
router.get('/', contestsControllers.getAllContests);

export default router;