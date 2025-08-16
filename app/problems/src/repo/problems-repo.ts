import { prisma } from "../prisma"
import { CustomError } from "../utils/errors/app-error";
import { CrudRepo } from "./crud-repo"

class ProblemsRepo extends CrudRepo {
    constructor() {
        super(prisma.problems)
    }

    async getByProblemsId(id: string) {
        try {
            return prisma.problems.findUnique({
                where: { id },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    functionName: true,
                    language: true,
                    difficulty: true,
                    testCases: true,
                    problemsTypes: true,
                    tags: true
                }
            });
        } catch (error) {
            throw new CustomError("Failed to create record", 500);
        }
    }

    async updateById(id: string, data: Object, select?: {}) {
        try {
            return prisma.problems.update({
                where: { id },
                data: { ...data },
                select: {
                    ...select
                }
            });
        } catch (error) {
            throw new CustomError("Failed to create record", 500);
        }
    }
}

export {
    ProblemsRepo
}