import {
    createContest,
    getContestById,
    getAllContest
} from "./contest-controllers";

import {
    createParticipant
} from "./participant-controllers";

import {
    submitSolution
} from "./submit-controllers";

const contestControllers = {
    createContest,
    getContestById,
    getAllContest
}

const participantControllers = {
    createParticipant
}

const submitControllers = {
    submitSolution
}

export {
    contestControllers,
    participantControllers,
    submitControllers
}