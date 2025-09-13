import { Router } from "express";
import { contestsControllers } from "../../controllers";
import { authMiddlewares } from "../../middlewares";
const router = Router();

const { isAdmin } = authMiddlewares;

router.post('/', isAdmin, contestsControllers.createContests);
router.get('/:id', contestsControllers.getContestsById);
router.get('/', contestsControllers.getAllContests);

export default router;