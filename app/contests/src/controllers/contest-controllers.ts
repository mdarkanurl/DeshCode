import { Request, Response, NextFunction } from "express";
import { contestsSchema } from "../schema";
import { contestsService } from "../services";
import { CustomError } from "../utils/errors/app-error";

async function createContests(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData: any = contestsSchema.createContests.safeParse(req.body);

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const contests = await contestsService.createContests(parseData.data);

        res.status(201).json({
            Success: true,
            Message: 'Contest created successfully',
            Data: contests,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getContestsById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = req.params.id;
        const contests = await contestsService.getContestById(id);

        res.status(201).json({
            Success: true,
            Message: 'Successfully fetched contest data',
            Data: contests,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getAllContests(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const {limit, page} = req.query;

        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;

        const skip = (pageNumber - 1) * limitNumber;

        const contests = await contestsService.getAllContests({
            skip,
            limit: limitNumber
        });

        res.status(200).json({
            Success: true,
            Message: 'Successfully fetched all contests',
            Data: contests,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    createContests,
    getContestsById,
    getAllContests
}