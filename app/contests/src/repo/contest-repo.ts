import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";
import { CustomError } from "../utils/errors/app-error";

class ContestsRepo extends CrudRepo {
    constructor() {
        super(prisma.contests)
    }

    async getContestById(id: string) {
        try {
            const contest = await prisma.contests.findUnique({
                where: {
                    id
                }
            });
            
            if(contest == null) throw new CustomError("Contest not found", 404);
            return contest;
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Failed to fetch contest data", 500)
        }
    }

    async getAllContestwithPagination(skip: number, take: number) {
        try {
            const contests = await prisma.contests.findMany({
                skip,
                take
            });

            if(contests.length == 0) throw new CustomError("No contest found", 404);

            return contests;
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Failed to fetch contest data", 500)
        }
    }
}

export {
    ContestsRepo
}