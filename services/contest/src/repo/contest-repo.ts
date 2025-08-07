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
}

export {
    ContestRepo
}