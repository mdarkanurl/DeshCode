import { Request, Response, NextFunction } from "express";
import { participantsSchema } from "../schema";
import { participantsService } from "../services";
import { CustomError } from "../utils/errors/app-error";
import { AuthRequest } from "../types";

async function createParticipants(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { contestId } = req.params;
        const userId = req.userId;

        const { success, error, data } = participantsSchema.createPaticipants.safeParse({
            contestId,
            userId
        });

        if(!success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        }

        const participants = await participantsService.createParticipants(data);

        res.status(201).json({
            Success: true,
            Message: 'participant created successfully',
            Data: participants,
            Errors: null
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500))
    }
}

async function getParticipantsByContestId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { contestId } = req.params as { contestId: string };

        if(!contestId) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: { contestId: 'Contest ID is required' }
            });
            return;
        }

        const participants = await participantsService.getParticipantsByContestId({ contestId });

        res.status(200).json({
            Success: true,
            Message: 'Participants retrieved successfully',
            Data: participants,
            Errors: null
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getParticipantsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { userId } = req.params as { userId: string };

        if(!userId) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: { userId: 'User ID is required' }
            });
            return;
        }

        const participants = await participantsService.getParticipantsByUserId({ userId });

        res.status(200).json({
            Success: true,
            Message: 'Participants retrieved successfully',
            Data: participants,
            Errors: null
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    createParticipants,
    getParticipantsByContestId,
    getParticipantsByUserId
}