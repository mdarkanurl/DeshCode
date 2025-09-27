import { Request, Response, NextFunction } from "express";
import { submissionsService } from "../services";
import { submissionsSchema } from "../schema";
import { CustomError } from "../utils/errors/app-error";
import { AuthRequest } from "../types";


async function submitSolution(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        // Get data
        const userId = req.userId;
        const { contestId } = req.params;
        const { participantId, problemId, language, code } = req.body;

        // Validate the req.body
        const parseData = submissionsSchema.submissionsSolution.safeParse({
            contestId,
            participantId,
            userId,
            problemId,
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

        const submission = await submissionsService.submissionsSolution(parseData.data);

        res.status(200).json({
            Success: true,
            Message: 'Solution submitted successfully',
            Data: submission,
            Errors: null
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
                Data: null,
                Errors: null
            });
        }

        const submission = await submissionsService.getSubmission(id);

        res.status(200).json({
            Success: true,
            Message: 'Submission retrieved successfully',
            Data: submission,
            Errors: null
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