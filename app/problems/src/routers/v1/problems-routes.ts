import { Router } from "express";
import { problemscontrollers } from "../../controllers";
const router = Router();

router.post('/', problemscontrollers.createProblems);
router.get('/', problemscontrollers.getAllProblems);
router.get('/:id', problemscontrollers.getProblem);
router.put('/:id', problemscontrollers.updateProblem);

export default router;