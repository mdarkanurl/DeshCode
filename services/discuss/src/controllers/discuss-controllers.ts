import { Request, Response, NextFunction } from "express";
import { discussSchema } from "../schema";
import { discussServices } from "../services";
import { CustomError } from "../utils/errors/app-error";

async function createDiscuss(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData: any = discussSchema.createDiscuss.safeParse(req.body);

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const discuss = discussServices.createDiscuss(req.body);

        res.status(201).json({
            Success: true,
            Message: 'Problem created successfully',
            Data: discuss,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    createDiscuss
}