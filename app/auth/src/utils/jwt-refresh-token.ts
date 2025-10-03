import jwt from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";
import { CustomError } from "./errors/app-error";
import { UserRole } from "@prisma/client";
dotenv.config();

function generateJwtRefreshToken(res: Response, data: { userId: string, role: UserRole }) {
    try {
        // Create a payload for JWT
        const payload = {
            userId: data.userId,
            role: data.role
        }

        // Generate token
        const token = jwt.sign(
            payload, process.env.REFRESH_TOKEN_SECRET || 'My_Refresh_Token_Secret',
            {
                expiresIn: '15d',

            }
        );

        // Set token to cookie
        res.cookie('refreshToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500)
    }
}

export {
    generateJwtRefreshToken
}