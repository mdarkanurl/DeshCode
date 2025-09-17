import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtToken } from "../utils";
import { CustomError } from "../utils/errors/app-error";
import dotenv from "dotenv";
import { UserRole } from "../types";

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
        } else if(!accessToken && !refreshToken) {
            res.status(401).json({
                Success: false,
                Message: "Unauthorized",
                Data: null,
                Errors: null,
            });
            return;
        } else if(!accessToken && refreshToken) {
            await handleRefreshToken(req, res, next);
            return;
        };

        // verify the access token
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET || 'My_Access_Token_Secret'
        ) as { role?: string; userId?: string; isVerified?: boolean };

        if (
            typeof decoded === "string" ||
            !decoded.role ||
            !decoded.userId ||
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
        const userId = decoded.userId as string;
        const role = decoded.role as UserRole;

        (req as any).userId = userId;
        (req as any).role = role;
        next();
    } catch (error) {
        console.log("Error from is-login.ts:", error);
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
        console.log('From handleRefreshToken function.....');
        const refreshToken = req.cookies['refreshToken'];

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
        ) as { userId?: string; role: UserRole };

        if (
            typeof decoded === "string" ||
            !decoded.userId ||
            !decoded.role
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
        const role = decoded.role as UserRole;

        // Generate JWT token
        jwtToken.accessToken(res, { userId, role });
        jwtToken.refreshToken(res, { userId, role });

        // Attach userId and role to request object
        (req as any).userId = userId;
        (req as any).role = role
        next();
    } catch (error) {
        console.log("Error from is-login.ts:", error);
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    islogin
}