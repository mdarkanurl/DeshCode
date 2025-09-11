import { Request, Response, NextFunction } from "express";
import { OauthService } from "../services";
import { CustomError } from "../utils/errors/app-error";

interface AuthRequest extends Request {
  users?: Object;
}

const googleCallback = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.users && (req.users as any).id;

        if(!userId) return;

        OauthService.googleCallback(res, {
            userId 
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
        const userId = req.users && (req.users as any).id;

        if(!userId) return;

        OauthService.githubCallback(res, {
            userId
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