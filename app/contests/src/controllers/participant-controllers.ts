import { Request, Response, NextFunction } from "express";
import { participantsSchema } from "../schema";
import { participantsService } from "../services";
import { CustomError } from "../utils/errors/app-error";

async function createParticipants(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData: any = participantsSchema.createPaticipants.safeParse(req.body);

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const participants = await participantsService.createParticipants(parseData.data);

        res.status(201).json({
            Success: true,
            Message: 'participant created successfully',
            Data: participants,
            Errors: {}
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
                Data: {},
                Errors: { contestId: 'Contest ID is required' }
            });
            return;
        }

        const participants = await participantsService.getParticipantsByContestId({ contestId });

        res.status(200).json({
            Success: true,
            Message: 'Participants retrieved successfully',
            Data: participants,
            Errors: {}
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    createParticipants,
    getParticipantsByContestId
}