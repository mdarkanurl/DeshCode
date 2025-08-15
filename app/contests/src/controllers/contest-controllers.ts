import { Request, Response, NextFunction } from "express";
import { contestSchema } from "../schema";
import { contestService } from "../services";
import { CustomError } from "../utils/errors/app-error";

async function createContest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData: any = contestSchema.createContest.safeParse(req.body);

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const contests = await contestService.createContest(parseData.data);

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

async function getContestById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const id = req.params.id;
        const contests = await contestService.getContestById(id);

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

async function getAllContest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const {limit, page} = req.query;

        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;

        const skip = (pageNumber - 1) * limitNumber;

        const contests = await contestService.getAllContest({
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
    createContest,
    getContestById,
    getAllContest
}