import {
    createContests,
    getContestById,
    getAllContests
} from "./contest-service";

import {
    createParticipants,
    getParticipantsByContestId,
    getParticipantsByUserId
} from "./participant-service";

import {
    submissionsSolution,
    getSubmission
} from "./submission-services";

 const contestsService = {
    createContests,
    getContestById,
    getAllContests
}

const participantsService = {
    createParticipants,
    getParticipantsByContestId,
    getParticipantsByUserId
}

const submissionsService = {
    submissionsSolution,
    getSubmission
}

 export {
    contestsService,
    participantsService,
    submissionsService
}