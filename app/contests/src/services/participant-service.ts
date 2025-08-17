import { ParticipantsRepo, ContestsRepo } from "../repo";
import { CustomError } from "../utils/errors/app-error";
const contestsRepo = new ContestsRepo();
const participantsRepo = new ParticipantsRepo();

async function createParticipants(data: {
    contestId: string,
    userId: string
}) {
    try {
        const isContestExists = await contestsRepo.getContestById(data.contestId);

        if(isContestExists == null) throw new CustomError("Contest dosen't exist", 404);

        const participants = await participantsRepo.create(data);
        return participants;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

export {
    createParticipants
}