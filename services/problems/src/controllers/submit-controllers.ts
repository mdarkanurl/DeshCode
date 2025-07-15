import { problemsSchema } from "../schema";
import { problemsServices } from "../services";
import { CustomError } from "../utils/errors/app-error";
import { Request, Response, NextFunction } from "express";
import { SubmitStatus } from "../generated/prisma";


async function submitSolution(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData = problemsSchema.submitSolutionSchema.safeParse(req.body);

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const submits = await problemsServices.submitSolution(parseData.data);

        res.status(200).json({
            Success: true,
            Message: 'Solution submitted successfully',
            Data: submits,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getSubmission(
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

        const submissions = await problemsServices.getSubmission({ id });

        const status = submissions.status;
        const messageMap: any = {
            [SubmitStatus.PENDING]: 'Submission is pending.',
            [SubmitStatus.ACCEPTED]: 'Submission accepted successfully.',
            [SubmitStatus.WRONG_ANSWER]: 'Submission returned wrong answer.',
            [SubmitStatus.EXECUTION_ERROR]: 'Submission encountered a runtime error.',
            [SubmitStatus.TIME_OUT]: 'Submission timed out.',
            [SubmitStatus.Failed]: 'Submission failed.',
            [SubmitStatus.INTERNAL_ERROR]: 'Submission encountered an internal error.',
            [SubmitStatus.INVALID_FUNCTION_SIGNATURE]: 'Submission has an invalid function signature.',
            [SubmitStatus.LANGUAGE_NOT_SUPPORTED]: 'Submission language is not supported.',
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
    submitSolution,
    getSubmission
}