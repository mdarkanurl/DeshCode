import { Request, Response, NextFunction } from "express";
import { OauthService } from "../services";
import { CustomError } from "../utils/errors/app-error";
import { OauthSchema } from "../schema";
import { AuthRequest } from "../types";

const googleCallback = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req?.user?.id;

        const { error, success, data } = OauthSchema.safeParse({ id: userId });

        if(!success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        };

        OauthService.googleCallback(res, {
            userId: data.id
        });

        res.status(201).json({
            Success: true,
            Message: `Successfully authenticate via Google`,
            Data: null,
            Errors: null
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

const githubCallback = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req?.user?.id;

        const { error, success, data } = OauthSchema.safeParse({ id: userId });

        if(!success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        };

        OauthService.githubCallback(res, {
            userId: data.id
        });

        res.status(201).json({
            Success: true,
            Message: `Successfully authenticate via GitHub`,
            Data: null,
            Errors: null
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    googleCallback,
    githubCallback
}