import {
    createContest,
    getContestById,
    getAllContest
} from "./contest-service";

import {
    createParticipant
} from "./participant-service";

import {
    submitSolution
} from "./submit-services";

 const contestService = {
    createContest,
    getContestById,
    getAllContest
}

const participantService = {
    createParticipant
}

const submitService = {
    submitSolution
}

 export {
    contestService,
    participantService,
    submitService
}