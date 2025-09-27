import { Request, Response, NextFunction } from "express";
import { submissionsSchema } from "../schema";
import { ContestsRepo } from "../repo";
import { CustomError } from "../utils/errors/app-error";
import { AuthRequest } from "../types";
const contestRepo = new ContestsRepo();

const CheckIsSubmissionAllow = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
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
        // Get the contest by ID
        const contests = await contestRepo.getContestById(parseData.data.contestId)

        // Check contest is started or not
        if(contests.startTime > new Date()) {
            res.status(400).json({
                Success: false,
                Message: 'Contest is not started yet',
                Data: null,
                Errors: null
            });
            return;
        }

        // check is end time is over or not
        if(contests.endTime < new Date()) {
            res.status(400).json({
                Success: false,
                Message: 'Contest is ended',
                Data: null,
                Errors: null
            });
            return;
        }
        next();
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    CheckIsSubmissionAllow
}