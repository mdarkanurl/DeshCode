import { Request, Response, NextFunction } from "express";
import { OauthService } from "../services";
import { CustomError } from "../utils/errors/app-error";

interface AuthRequest extends Request {
  userId?: string;
}

const googleCallback = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.userId;

        if(!userId) return;

        OauthService.googleCallback(res, {
            userId 
        });

        res.status(201).json({
            Success: true,
            Message: ``,
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
    googleCallback
}