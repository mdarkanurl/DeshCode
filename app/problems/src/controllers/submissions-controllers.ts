import { submissionsSchema } from "../schema";
import { submissionsServices } from "../services";
import { CustomError } from "../utils/errors/app-error";
import { Request, Response, NextFunction } from "express";
import { SubmissionsStatus } from "@prisma/client";

interface AuthRequest extends Request {
    userId?: String
}


async function submissionsSolution(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.userId as string;
        const { problemsId, language, code } = req.body;
        const parseData = submissionsSchema.submissionsSolutionSchema.safeParse({
            userId,
            problemsId,
            language,
            code
        });

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: parseData.error.errors
            });
            return;
        }

        const submissions = await submissionsServices.submissionsSolution(parseData.data);

        res.status(200).json({
            Success: true,
            Message: 'Solution submitted successfully',
            Data: submissions,
            Errors: null
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
                Data: null,
                Errors: null
            });
            return;
        }

        const submissions = await submissionsServices.getSubmissionById({ id });

        const status = submissions.status;
        const messageMap: any = {
            [SubmissionsStatus.PENDING]: 'Submission is pending.',
            [SubmissionsStatus.ACCEPTED]: 'Submission accepted successfully.',
            [SubmissionsStatus.WRONG_ANSWER]: 'Submission returned wrong answer.',
            [SubmissionsStatus.EXECUTION_ERROR]: 'Submission encountered a runtime error.',
            [SubmissionsStatus.TIME_OUT]: 'Submission timed out.',
            [SubmissionsStatus.FAILED]: 'Submission failed.',
            [SubmissionsStatus.INTERNAL_ERROR]: 'Submission encountered an internal error.',
            [SubmissionsStatus.INVALID_FUNCTION_SIGNATURE]: 'Submission has an invalid function signature.',
            [SubmissionsStatus.LANGUAGE_NOT_SUPPORTED]: 'Submission language is not supported.',
        };

        res.status(200).json({
            Success: true,
            Message: messageMap[status] || 'Unknown submission status.',
            Data: submissions,
            Errors: null
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