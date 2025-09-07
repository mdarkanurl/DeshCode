// This function check request has JWT token or not

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { jwtToken } from "../utils";
import { CustomError } from "../utils/errors/app-error";
dotenv.config({ path: '../.env' });


async function isJwtTokenExists(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { accessToken, refreshToken } = req.cookies;

        if(!accessToken && refreshToken) {
            await handleRefreshToken(req, res, next);
            return;
        };

        // verify the access token
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET || 'My_Access_Token_Secret'
        );

        if (typeof decoded === "string" || !("email" in decoded)) {
            res.status(401).json({
                Success: false,
                Message: "Unauthorized",
                Data: null,
                Errors: null,
            });
            return;
        }

        // Access payload safely
        const email: string = decoded.email;
        const isVerified: boolean = decoded.isVerified;

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
        );

        if (typeof decoded === "string" || !("email" in decoded)) {
            res.status(401).json({
                Success: false,
                Message: "Unauthorized",
                Data: null,
                Errors: null,
            });
            return;
        }

        // Access payload safely
        const email: string = decoded.email;
        const isVerified: boolean = decoded.isVerified;

        // Generate access token
        jwtToken.accessToken(res, { email, isVerified });

        // Recreate refresh token
        jwtToken.refreshToken(res, { email, isVerified });

        // Attach email and isVerified to request object
        (req as any).email = email;
        (req as any).isVerified = isVerified;
        next();
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    isJwtTokenExists
}