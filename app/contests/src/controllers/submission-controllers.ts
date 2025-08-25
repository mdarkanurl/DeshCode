import { Request, Response, NextFunction } from "express";
import { submissionsService } from "../services";
import { submissionsSchema } from "../schema";
import { CustomError } from "../utils/errors/app-error";


async function submitSolution(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData = submissionsSchema.submissionsSolution.safeParse(req.body);

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const submission = await submissionsService.submissionsSolution(parseData.data);

        res.status(200).json({
            Success: true,
            Message: 'Solution submitted successfully',
            Data: submission,
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

        if (isNaN(id)) {
            return res.status(404).json({
                Success: false,
                Message: 'Invalid submission ID',
                Data: {},
                Errors: {}
            });
        }

        const submission = await submissionsService.getSubmission(id);

        res.status(200).json({
            Success: true,
            Message: 'Submission retrieved successfully',
            Data: submission,
            Errors: {}
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    submitSolution,
    getSubmission
}