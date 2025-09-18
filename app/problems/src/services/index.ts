import { createProblems, getAllProblems, getProblems, updateProblems, deleteProblems } from "./problems-services";
import { submissionsSolution, getSubmissionById } from "./submissions-services";

const problemsServices = {
    createProblems,
    getAllProblems,
    getProblems,
    updateProblems,
    deleteProblems
}

const submissionsServices = {
    submissionsSolution,
    getSubmissionById
}

export {
    problemsServices,
    submissionsServices
}