import { ParticipantRepo, ContestRepo } from "../repo";
import { CustomError } from "../utils/errors/app-error";
const contestRepo = new ContestRepo();
const participantRepo = new ParticipantRepo();

async function createParticipant(data: {
    contestId: string,
    userId: string
}) {
    try {
        const isContestExists = await contestRepo.getContestById(data.contestId);

        if(isContestExists == null) throw new CustomError("Contest dosen't exist", 404);

        const participant = await participantRepo.create(data);
        return participant;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

export {
    createParticipant
}