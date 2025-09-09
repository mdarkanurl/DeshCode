// This function check whether the request has temp JWT token or not

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { jwtToken } from "../utils";
import { CustomError } from "../utils/errors/app-error";
dotenv.config({ path: '../.env' });


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

        // verify the temp token
        const decoded = jwt.verify(
            token,
            process.env.TEMP_JWT_TOKEN || 'Temp-Secret-JWT-Token'
        );

        if (typeof decoded === "string" || !("userId" in decoded)) {
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