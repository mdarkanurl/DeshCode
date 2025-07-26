import { createProblems, getAllProblems, getProblem, updateProblem } from "./problems-services";
import { submitSolution, getSubmission } from "./submit-service";

const problemsServices = {
    createProblems,
    getAllProblems,
    getProblem,
    submitSolution,
    updateProblem,
    getSubmission
}

export {
    problemsServices
}