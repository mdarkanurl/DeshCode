import { createProblems, getAllProblems, getProblem, updateProblem } from "./problems-controllers";
import { submissionsSolution, getSubmissionsById } from "./submissions-controllers";

const problemscontrollers = {
    createProblems,
    getAllProblems,
    getProblem,
    updateProblem
}

const submissionsControllers = {
    submissionsSolution,
    getSubmissionsById
}

export {
    problemscontrollers,
    submissionsControllers
}