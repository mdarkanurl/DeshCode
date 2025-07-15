import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/errors/app-error";
import { problemsSchema } from "../schema";
import { problemsServices } from "../services";

async function createProblems(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData: any = problemsSchema.createProblemsSchema.safeParse(req.body);

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const problems = await problemsServices.createProblems(parseData.data);
        
        res.status(201).json({
            Success: true,
            Message: 'Problem created successfully',
            Data: problems,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getAllProblems(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { difficulty, tags, language, page, limit } = req.query;

        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        let tagsArray: string[] = [];
        let languageArray: string[] = [];
        const difficultyStr = difficulty as string;

        const DifficultyLevel = ["EASY", "MEDIUM", "HARD"]

        if (difficulty && !DifficultyLevel.includes(difficultyStr)) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid difficulty level',
                Data: {},
                Errors: {}
            });
            return;
        }

        if (typeof language === 'string') {
            languageArray = language.split(',').map(lan => lan.trim());
        } else if (Array.isArray(language)) {
            languageArray = language
                .filter((lan): lan is string => typeof lan === 'string')
                .map(lan => lan.trim());
        }

        if (typeof tags === 'string') {
            tagsArray = tags.split(',').map(tag => tag.trim());
        } else if (Array.isArray(tags)) {
            tagsArray = tags
                .filter((tag): tag is string => typeof tag === 'string')
                .map(tag => tag.trim());
        }

        const skip = (pageNumber - 1) * limitNumber; // page => 2 = (2 - 1) = 1 and limit => 10

        const problems = await problemsServices.getAllProblems(
            {
                difficulty: difficultyStr,
                tags: tagsArray,
                language: languageArray,
                skip,
                limit: limitNumber
            }
        );
        res.status(200).json({
            Success: true,
            Message: 'All problems successfully get from Database',
            Data: problems,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getProblem(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData = problemsSchema.getProblemSchema.safeParse({ id: (req.params.id) });

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const problem = await problemsServices.getProblem(parseData.data);

        res.status(200).json({
            Success: true,
            Message: 'Problem get successfully',
            Data: problem,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function updateProblem(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData = problemsSchema.updateProblemSchema.safeParse(req.body);
        const problemId = req.params.id as string;

        if(!parseData.success || req.body === null || undefined || !problemId) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData?.error?.errors
            });
            return;
        }

        const problems = await problemsServices.updateProblem(
            {
                id: problemId,
                data: {
                    title: parseData.data.title,
                    description: parseData.data.description,
                    language: parseData.data.language,
                    testCases: parseData.data.testCases,
                    tags: parseData.data.tags
                }
            }
        )

        res.status(200).json({
            Success: true,
            Message: 'Problem successfully updated',
            Data: problems,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    createProblems,
    getAllProblems,
    getProblem,
    updateProblem
}