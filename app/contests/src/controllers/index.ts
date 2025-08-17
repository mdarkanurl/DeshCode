import {
    createContests,
    getContestsById,
    getAllContests
} from "./contest-controllers";

import {
    createParticipants
} from "./participant-controllers";

import { submitSolution } from "./submission-controllers";

const contestsControllers = {
    createContests,
    getContestsById,
    getAllContests
}

const participantsControllers = {
    createParticipants
}

const submissionsControllers = {
    submitSolution
}

export {
    contestsControllers,
    participantsControllers,
    submissionsControllers
}