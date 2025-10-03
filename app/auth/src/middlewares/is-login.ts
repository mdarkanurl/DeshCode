import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { jwtToken } from "../utils";
import { CustomError } from "../utils/errors/app-error";
import dotenv from "dotenv";
import { UserRole } from "@prisma/client";

dotenv.config();

const islogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const accessToken = req.cookies['accessToken'];
        const refreshToken = req.cookies['refreshToken'];

        if(!accessToken && !refreshToken) {
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

        let decoded;
        try {
            // verify the access token
            decoded = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET || 'My_Access_Token_Secret'
            ) as { role?: string; userId?: string; };
        } catch (error) {

            if (error instanceof TokenExpiredError) {
                await handleRefreshToken(req, res, next);
                return;
            }

            if (error instanceof NotBeforeError) {
                return res.status(401).json({
                    Success: false,
                    Message: "Invalid/malformed token, authentication failed",
                    Data: null,
                    Errors: null,
                });
            }

            if (error instanceof JsonWebTokenError) {
                res.status(401).json({
                    Success: false,
                    Message: "Token not active yet",
                    Data: null,
                    Errors: null,
                });
            }
        }


        if (
            !decoded ||
            !decoded.role ||
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
        const role = decoded.role as UserRole;

        (req as any).userId = userId;
        (req as any).role = role;
        next();
    } catch (error) {
        console.log(error)
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

        let decoded;
        try {
            // verify the refresh token
            decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET || 'My_Refresh_Token_Secret'
            ) as { userId?: string; role: UserRole };
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                res.status(401).json({
                    Success: false,
                    Message: "Token expired, user must re-authenticate",
                    Data: null,
                    Errors: null,
                });
                return;
            }

            if (error instanceof NotBeforeError) {
                res.status(401).json({
                    Success: false,
                    Message: "Invalid/malformed token, authentication failed",
                    Data: null,
                    Errors: null,
                });
                return;
            }

            if (error instanceof JsonWebTokenError) {
                res.status(401).json({
                    Success: false,
                    Message: "Token not active yet",
                    Data: null,
                    Errors: null,
                });
                return;
            }
        }

        if (
            !decoded ||
            !decoded.role ||
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
        const role = decoded.role as UserRole;

        // Generate JWT token
        jwtToken.accessToken(res, { userId, role });
        jwtToken.refreshToken(res, { userId, role });

        // Attach userId and role to request object
        (req as any).userId = userId;
        (req as any).role = role
        next();
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    islogin
}