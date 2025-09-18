import { ProblemsRepo } from "../repo";
import { DifficultyLevel } from "../generated/prisma";
import { CustomError } from "../utils/errors/app-error";
import { prisma } from "../prisma";

const problemsRepo = new ProblemsRepo();

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
        const isProblemExist = await problemsRepo.getByProblemsId(data.id);

        if(isProblemExist) {
            throw new CustomError(`The problem id ${data.id} already taken`, 400);
        }


        // Create problems and add to DB
        const problems = await problemsRepo.create(data);
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
            whereClause.tags = { hasSome: data.tags };
        }

        if (data.language && data.language.length > 0) {
            whereClause.language = { hasSome: data.language };
        }

        let total = 0;
        try {
            // Get total count for pagination
            total = await prisma.problems.count({
                where: whereClause
            });
        } catch (error) {
           throw new CustomError('Internal server error', 500); 
        }

        // Get all problems from Database
        const problems = await prisma.problems.findMany({
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

async function getProblems(data: { id: string }) {
    try {
        // Find problem by ID
        const problems = await problemsRepo.getByProblemsId(data.id);

        if(!problems) {
            throw new CustomError('Problem not found', 404);
        }

        return problems;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function updateProblems(
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
        return await problemsRepo.updateById(
            data.id,
            data.data
        );
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function deleteProblems(data: { id: string }) {
    try {
        const problems = await problemsRepo.getByProblemsId(data.id);

        if(!problems) {
            throw new CustomError("Problem not found", 404);
        }

        // Delete the problem
        const deleteProblems = await problemsRepo.destroyById(problems.id);

        if(!deleteProblems) {
            throw new CustomError('Internal Server Error', 500);
        }

        return deleteProblems;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

export {
    createProblems,
    getAllProblems,
    getProblems,
    updateProblems,
    deleteProblems
}