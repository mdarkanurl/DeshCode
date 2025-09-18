import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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

    async updateById(id: string, data: Object) {
        try {
            const problems = await prisma.problems.update({
                where: { id },
                data: { ...data }
            });
            return problems;
        } catch (error: any) {
            if (error.code === "P2025") {
                throw new CustomError("Problem not found", 404);
            }
            throw new CustomError("Failed to update record", 500);
        }
    }

    async destroyById(id: string) {
        try {
            return await prisma.problems.delete({
                where: { id }
            });
        } catch (error) {
            throw new CustomError("Failed to delete record", 500);
        }
    }
}

export {
    ProblemsRepo
}