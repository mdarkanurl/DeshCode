import {
    createProblemsSchema,
    getProblemsSchema,
    updateProblemsSchema,
    deleteProblemsSchema
} from "./problems-schema";

import {
    submissionsSolutionSchema
} from "./submissions-schema";

const problemsSchema = {
    createProblemsSchema,
    getProblemsSchema,
    updateProblemsSchema,
    deleteProblemsSchema
}

const submissionsSchema = {
    submissionsSolutionSchema
}

export {
    problemsSchema,
    submissionsSchema
}