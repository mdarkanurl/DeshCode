import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtToken } from "../utils";
import { CustomError } from "../utils/errors/app-error";
import dotenv from "dotenv";

dotenv.config({ path: '../.env' });

const islogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const accessToken = req.cookies['accessToken'];
        const refreshToken = req.cookies['refreshToken'];

        if(!accessToken && refreshToken) {
            await handleRefreshToken(req, res, next);
            return;
        };

        // verify the access token
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET || 'My_Access_Token_Secret'
        ) as { email?: string; isVerified?: boolean };;

        if (
            typeof decoded === "string" ||
            !decoded.email ||
            decoded.isVerified === false
        ) {
            res.status(401).json({
                Success: false,
                Message: "Unauthorized",
                Data: null,
                Errors: null,
            });
            return;
        }

        // Access payload safely
        const email = decoded.email as string;
        const isVerified = decoded.isVerified as boolean;

        (req as any).email = email;
        (req as any).isVerified = isVerified;
        next();
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function handleRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { refreshToken } = req.cookies;

        if(!refreshToken) {
            res.status(401).json({
                Success: false,
                Message: 'Unauthorized',
                Data: null,
                Errors: null
            });
            return;
        }

        // verify the refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET || 'My_Refresh_Token_Secret'
        ) as { userId?: string; };

        if (
            typeof decoded === "string" ||
            !decoded.userId
        ) {
            res.status(401).json({
                Success: false,
                Message: "Unauthorized",
                Data: null,
                Errors: null,
            });
            return;
        }

        // Access payload safely
        const userId = decoded.userId as string;

        // Generate access token
        jwtToken.accessToken(res, { userId });

        // Recreate refresh token
        jwtToken.refreshToken(res, { userId });

        // Attach email and isVerified to request object
        (req as any).userId = userId
        next();
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    islogin
}