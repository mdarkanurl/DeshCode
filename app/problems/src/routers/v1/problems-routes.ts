import { Router } from "express";
import { problemscontrollers } from "../../controllers";
const router = Router();

import { authMiddlewares } from "../../middlewares";
const { isAdmin } = authMiddlewares;

router.post('/', isAdmin, problemscontrollers.createProblems);
router.get('/', problemscontrollers.getAllProblems);
router.get('/:id', problemscontrollers.getProblem);
router.put('/:id', isAdmin, problemscontrollers.updateProblem);

export default router;