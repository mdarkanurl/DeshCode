import {
    createContests,
    getContestsById,
    getAllContests
} from "./contest-controllers";

import {
    createParticipants,
    getParticipantsByContestId
} from "./participant-controllers";

import {
    submitSolution,
    getSubmission
} from "./submission-controllers";

const contestsControllers = {
    createContests,
    getContestsById,
    getAllContests
}

const participantsControllers = {
    createParticipants,
    getParticipantsByContestId
}

const submissionsControllers = {
    submitSolution,
    getSubmission
}

export {
    contestsControllers,
    participantsControllers,
    submissionsControllers
}