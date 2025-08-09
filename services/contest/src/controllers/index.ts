import {
    createContest,
    getContestById,
    getAllContest
} from "./contest-controllers";

import {
    createPaticipant
} from "./participant-controllers";

import {
    submitSolution
} from "./submit-controolers";

const contestControllers = {
    createContest,
    getContestById,
    getAllContest
}

const participantControllers = {
    createPaticipant
}

const submitControllers = {
    submitSolution
}

export {
    contestControllers,
    participantControllers,
    submitControllers
}