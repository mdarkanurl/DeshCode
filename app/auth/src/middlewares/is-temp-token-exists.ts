// This function check whether the request has temp JWT token or not

import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import dotenv from "dotenv";
import { CustomError } from "../utils/errors/app-error";
dotenv.config();


async function isTempJwtTokenExists(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers["authorization"];

        // extract actual token
        const token = authHeader?.split(" ")[1];

        if (!authHeader ||!token || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                Success: false,
                Message: "Missing token",
                Data: null,
                Errors: null,
            });
            return;
        }

        let decoded;
        try {
            // verify the temp token
            decoded = jwt.verify(
                token,
                process.env.TEMP_JWT_TOKEN || 'Temp-Secret-JWT-Token'
            );
        } catch (error) {
            // Handle JWT-specific errors
            if (error instanceof JsonWebTokenError) {
                res.status(401).json({
                    Success: false,
                    Message: "Unauthorized: Invalid token",
                    Data: null,
                    Errors: error.message,
                });
                return;
            }

            if (error instanceof TokenExpiredError) {
                res.status(401).json({
                    Success: false,
                    Message: "Unauthorized: Token expired",
                    Data: null,
                    Errors: error.message,
                });
                return;
            }
        }

        if (typeof decoded === "string" || !decoded || !("userId" in decoded)) {
            res.status(401).json({
                Success: false,
                Message: "Unauthorized",
                Data: null,
                Errors: null,
            });
            return;
        }

        // Access payload safely
        const userId: string = decoded.userId;

        (req as any).userId = userId;
        next();
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}


export {
    isTempJwtTokenExists
}