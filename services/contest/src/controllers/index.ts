import {
    createContest,
    getContestById,
    getAllContest
} from "./contest-controllers";

import {
    createPaticipant
} from "./participant-controllers";

const contestControllers = {
    createContest,
    getContestById,
    getAllContest
}

const participantControllers = {
    createPaticipant
}

export {
    contestControllers,
    participantControllers
}