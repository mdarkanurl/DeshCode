import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";
import { CustomError } from "../utils/errors/app-error";

class ContestRepo extends CrudRepo {
    constructor() {
        super(prisma.contest)
    }

    async getContestById(id: string, select?: {}) {
        try {
            const contest = await prisma.contest.findUnique({
                where: {
                    id
                },
                select: {
                    ...select
                }
            });
            
            if(contest == null) throw new CustomError("Contest not found", 404);
            return contest;
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Faild to fatch contest data", 500)
        }
    }

    async getAllContestwithPagination(skip: number, take: number, select?: {}) {
        try {
            const contests = await prisma.contest.findMany({
                skip,
                take,
                select: {
                    ...select
                }
            });

            if(contests.length == 0) throw new CustomError("No contest found", 404);

            return contests;
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Faild to fatch contest data", 500)
        }
    }
}

export {
    ContestRepo
}