import { submissionsSchema } from "../schema";
import { submissionsServices } from "../services";
import { CustomError } from "../utils/errors/app-error";
import { Request, Response, NextFunction } from "express";
import { submissionsStatus } from "../generated/prisma";


async function submissionsSolution(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData = submissionsSchema.submissionsSolutionSchema.safeParse(req.body);

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const submissions = await submissionsServices.submissionsSolution(parseData.data);

        res.status(200).json({
            Success: true,
            Message: 'Solution submitted successfully',
            Data: submissions,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getSubmissionsById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = parseInt(req.params.id);

        if(!id) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input, ID params missing',
                Data: {},
                Errors: {}
            });
            return;
        }

        const submissions = await submissionsServices.getSubmissionById({ id });

        const status = submissions.status;
        const messageMap: any = {
            [submissionsStatus.PENDING]: 'Submission is pending.',
            [submissionsStatus.ACCEPTED]: 'Submission accepted successfully.',
            [submissionsStatus.WRONG_ANSWER]: 'Submission returned wrong answer.',
            [submissionsStatus.EXECUTION_ERROR]: 'Submission encountered a runtime error.',
            [submissionsStatus.TIME_OUT]: 'Submission timed out.',
            [submissionsStatus.FAILED]: 'Submission failed.',
            [submissionsStatus.INTERNAL_ERROR]: 'Submission encountered an internal error.',
            [submissionsStatus.INVALID_FUNCTION_SIGNATURE]: 'Submission has an invalid function signature.',
            [submissionsStatus.LANGUAGE_NOT_SUPPORTED]: 'Submission language is not supported.',
        };

        res.status(200).json({
            Success: true,
            Message: messageMap[status] || 'Unknown submission status.',
            Data: submissions,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    submissionsSolution,
    getSubmissionsById
}