import {
    createProblemsSchema,
    getProblemsSchema,
    updateProblemsSchema
} from "./problems-schema";

import {
    submissionsSolutionSchema
} from "./submissions-schema";

const problemsSchema = {
    createProblemsSchema,
    getProblemsSchema,
    updateProblemsSchema
}

const submissionsSchema = {
    submissionsSolutionSchema
}

export {
    problemsSchema,
    submissionsSchema
}