import jwt from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";
import { CustomError } from "./errors/app-error";
dotenv.config({ path: '../.env' });

function generateJwtRefreshToken(res: Response, data: { userId: string }) {
    try {
        // Create a payload for JWT
        const payload = {
            email: data.userId
        }

        // Generate token
        const token = jwt.sign(
            payload, process.env.REFRESH_TOKEN_SECRET || 'My_Refresh_Token_Secret',
            {
                expiresIn: '30d',

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