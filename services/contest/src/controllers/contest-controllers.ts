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

        const contest = await contestService.createContest(parseData.data);

        res.status(201).json({
            Success: true,
            Message: 'Contest created successfully',
            Data: contest,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    createContest
}