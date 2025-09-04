import e, { Request, Response, NextFunction } from "express";
import { leaderboardService } from "../services";
import { CustomError } from "../utils/errors/app-error";

async function getLeaderboardResultsByContestId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { contestId } = req.params;
        const { page, limit } = req.query;

        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const users = await leaderboardService.getLeaderboardResultsByContestId({
            contestId: contestId as string,
            skip,
            limit: limitNumber
        });

        res.status(200).json({
            Success: true,
            Message: 'All users successfully retrieved',
            Data: users,
            Errors: {}
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    getLeaderboardResultsByContestId
}