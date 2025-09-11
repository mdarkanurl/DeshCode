import jwt from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";
import { CustomError } from "./errors/app-error";
dotenv.config({ path: '../.env' });

function generateJwtAccessToken(res: Response, data: { userId: string }) {
    try {
        // Create a payload for JWT
        const payload = {
            email: data.userId,
        }

        // Generate token
        const token = jwt.sign(
            payload, process.env.ACCESS_TOKEN_SECRET || 'My_Access_Token_Secret',
            {
                expiresIn: '15m',
            }
        );

        // Set token to cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 3600000
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500)
    }
}

export {
    generateJwtAccessToken
}