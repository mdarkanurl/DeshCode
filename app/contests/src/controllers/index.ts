import {
    createContests,
    getContestsById,
    getAllContests
} from "./contest-controllers";

import {
    createParticipants,
    getParticipantsByContestId,
    getParticipantsByUserId
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
    getParticipantsByContestId,
    getParticipantsByUserId
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