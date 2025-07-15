import { prisma } from "../prisma"
import { CustomError } from "../utils/errors/app-error";
import { CrudRepo } from "./crud-repo"

class ProblemRepo extends CrudRepo {
    constructor() {
        super(prisma.problem)
    }

    async getByProblemId(id: string) {
        try {
            return prisma.problem.findUnique({
                where: { id }
            });
        } catch (error) {
            throw new CustomError("Failed to create record", 500);
        }
    }

    async updateById(id: string, data: Object) {
        try {
            return prisma.problem.update({
                where: { id },
                data: { ...data },
                select: {
                    isSolved: false
                }
            });
        } catch (error) {
            throw new CustomError("Failed to create record", 500);
        }
    }
}

export {
    ProblemRepo
}