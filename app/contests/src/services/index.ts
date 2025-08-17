import {
    createContests,
    getContestById,
    getAllContests
} from "./contest-service";

import {
    createParticipants
} from "./participant-service";

import {
    submissionsSolution
} from "./submission-services";

 const contestsService = {
    createContests,
    getContestById,
    getAllContests
}

const participantsService = {
    createParticipants
}

const submissionsService = {
    submissionsSolution
}

 export {
    contestsService,
    participantsService,
    submissionsService
}