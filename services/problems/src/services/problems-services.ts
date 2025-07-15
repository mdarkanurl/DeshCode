import { ProblemRepo } from "../repo";
import { DifficultyLevel } from "../generated/prisma";
import { CustomError } from "../utils/errors/app-error";
import { prisma } from "../prisma";

const problemRepo = new ProblemRepo();

async function createProblems(data: {
    id: string,
    title: string,
    description: string,
    functionName: string,
    language: string[],
    difficulty: DifficultyLevel,
    testCases: JSON[],
    tags?: string
}) {
    try {
        // Check if problem already exist or not
        const isProblemExist = await problemRepo.getByProblemId(data.id);

        if(isProblemExist) {
            throw new CustomError(`The problem id ${data.id} already taken`, 400);
        }


        // Create problems and add to DB
        const problems = await problemRepo.create(data);
        return {
            id: problems.id,
            title: problems.title,
            description: problems.description,
            functionName: problems.functionName,
            language: problems.language,
            difficulty: problems.difficulty,
            testCases: problems.testCases,
            tags: problems.tags
        };
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function getAllProblems(
    data: {
        difficulty: string | undefined,
        tags: string[] | undefined,
        language: string[] | undefined,
        skip: number,
        limit: number
    }
) {
    try {
        const whereClause: any = {};

        if (data.difficulty !== undefined) {
            whereClause.difficulty = data.difficulty;
        }

        if (data.tags && data.tags.length > 0) {
            whereClause.tags = { hasSome: data.tags }; // tags is a string[]
        }

        if (data.language && data.language.length > 0) {
            whereClause.language = { hasSome: data.language }; // language is a string[]
        }

        // Get total count for pagination
        const total = await prisma.problem.count({
            where: whereClause
        });

        // Get all problems from Database
        const problems = await prisma.problem.findMany({
            where: whereClause,
            select: {
                id: true,
                title: true,
                language: true,
                difficulty: true,
                tags: true
            },
            skip: data.skip,
            take: data.limit
        });

        if(problems.length === 0) {
            throw new CustomError('No problems found', 404);
        }

        return {
            problems,
            pagination: {
                totalItems: total,
                currentPage: Math.floor(data.skip / data.limit) + 1,
                totalPages: Math.ceil(total / data.limit),
                pageSize: data.limit
            }
        };
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function getProblem(data: { id: string }) {
    try {
        // Find problem by ID
        const problem = await problemRepo.getByProblemId(data.id);

        if(!problem) {
            throw new CustomError('Problem not found', 404);
        }

        return {
            id: problem.id,
            title: problem.title,
            description: problem.description,
            functionName: problem.functionName,
            language: problem.language,
            difficulty: problem.difficulty,
            testCases: problem.testCases,
            tags: problem.tags
        };
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function updateProblem(
    data: {
        id: string,
        data: {
            title: string | undefined,
            description: string | undefined,
            language: string[] | undefined,
            testCases: any,
            tags?: string[] | undefined
        }
    }
) {
    try {
        const problems = await problemRepo.updateById(
            data.id,
            data.data
        );

        if(!problems) {
            throw new CustomError('Problem can not update. Please check problem ID', 404);
        }

        return problems;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

export {
    createProblems,
    getAllProblems,
    getProblem,
    updateProblem
}