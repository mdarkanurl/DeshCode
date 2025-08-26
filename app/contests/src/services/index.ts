import {
    createContests,
    getContestById,
    getAllContests
} from "./contest-service";

import {
    createParticipants,
    getParticipantsByContestId
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
    getParticipantsByContestId
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