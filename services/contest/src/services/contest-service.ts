import { ContestRepo } from "../repo";
import { CustomError } from "../utils/errors/app-error";
const contestRepo = new ContestRepo();


async function createContest(data: {
    name: string;
    description: string;
    rules: string;
    problemIds: string[];
    startDate: Date;
    endDate: Date;
}) {
    try {
        const isValidTime = data.endDate > data.startDate;
        if (!isValidTime) throw new CustomError("Invalid time", 400);

        const contest = await contestRepo.create(data);
        return contest;
    } catch (error: any) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500)
    }
}

export {
    createContest

}