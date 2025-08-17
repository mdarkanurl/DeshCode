import { ContestsRepo } from "../repo";
import { CustomError } from "../utils/errors/app-error";
const contestRepo = new ContestsRepo();


async function createContests(data: {
    name: string;
    description: string;
    rules: string;
    problemsId: string[];
    startDate: Date;
    endDate: Date;
}) {
    try {
        const contests = await contestRepo.create(data);
        return contests;
    } catch (error: any) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500)
    }
}

async function getContestById(id: string) {
    try {
        const contests = await contestRepo.getContestById(id);
        return contests;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500)
    }
}

async function getAllContests(data: {
    skip: number,
    limit: number
}) {
    try {
        if (data.skip < 0 || data.limit <= 0) {
            throw new CustomError("Invalid pagination parameters", 400);
        }

        return await contestRepo.getAllContestwithPagination(data.skip, data.limit);
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500)
    }
}

export {
    createContests,
    getContestById,
    getAllContests
}