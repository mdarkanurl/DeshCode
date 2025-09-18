import { createProblems, getAllProblems, getProblem, updateProblem, deleteProblems } from "./problems-controllers";
import { submissionsSolution, getSubmissionsById } from "./submissions-controllers";

const problemscontrollers = {
    createProblems,
    getAllProblems,
    getProblem,
    updateProblem,
    deleteProblems
}

const submissionsControllers = {
    submissionsSolution,
    getSubmissionsById
}

export {
    problemscontrollers,
    submissionsControllers
}