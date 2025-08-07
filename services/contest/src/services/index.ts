import {
    createContest,
    getContestById,
    getAllContest
} from "./contest-service";

import {
    createParticipant
} from "./participant-service";

 const contestService = {
    createContest,
    getContestById,
    getAllContest
}

const participantService = {
    createParticipant
}

 export {
    contestService,
    participantService
}