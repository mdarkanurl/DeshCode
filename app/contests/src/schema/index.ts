import {
    createContest
} from "./contest-schema";

import {
    createPaticipant
} from "./participant-schema";

import { submitSolution } from "./submit-schema";

const contestSchema = {
    createContest
}

const participantSchema = {
    createPaticipant
}

const submitSchema = {
    submitSolution
}

export {
    contestSchema,
    participantSchema,
    submitSchema
}