import { createProblems, getAllProblems, getProblems, updateProblems } from "./problems-services";
import { submissionsSolution, getSubmissionById } from "./submissions-services";

const problemsServices = {
    createProblems,
    getAllProblems,
    getProblems,
    updateProblems
}

const submissionsServices = {
    submissionsSolution,
    getSubmissionById
}

export {
    problemsServices,
    submissionsServices
}