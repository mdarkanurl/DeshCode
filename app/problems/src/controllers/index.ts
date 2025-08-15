import { createProblems, getAllProblems, getProblem, updateProblem } from "./problems-controllers";
import { submitSolution, getSubmission } from "./submit-controllers";

const problemscontrollers = {
    createProblems,
    getAllProblems,
    getProblem,
    submitSolution,
    updateProblem,
    getSubmission
}

export {
    problemscontrollers
}