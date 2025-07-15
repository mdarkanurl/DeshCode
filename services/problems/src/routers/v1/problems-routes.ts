import { Router } from "express";
import { problemscontrollers } from "../../controllers";
const router = Router();

router.post('/problems', problemscontrollers.createProblems);
router.get('/problems', problemscontrollers.getAllProblems);
router.get('/problems/:id', problemscontrollers.getProblem);
router.put('/problems/:id', problemscontrollers.updateProblem);
router.post('/submit', problemscontrollers.submitSolution);
router.get('/submit/:id', problemscontrollers.getSubmission);

export default router;