import { Request, Response, NextFunction } from "express";
import { submissionsSchema } from "../schema";
import { ContestsRepo } from "../repo";
import { CustomError } from "../utils/errors/app-error";
const contestRepo = new ContestsRepo();

const CheckIsSubmissionAllow = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate the req.body
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
        // Get the contest by ID
        const contests = await contestRepo.getContestById(parseData.data.contestId)

        // Check contest is started or not
        if(contests.startTime > new Date()) {
            res.status(400).json({
                Success: false,
                Message: 'Contest is not started yet',
                Data: {},
                Errors: {}
            });
            return;
        }

        // check is end time is over or not
        if(contests.endTime < new Date()) {
            res.status(400).json({
                Success: false,
                Message: 'Contest is ended',
                Data: {},
                Errors: {}
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