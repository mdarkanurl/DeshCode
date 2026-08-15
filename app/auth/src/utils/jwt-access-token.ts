import jwt from "jsonwebtoken";
import { Response } from "express";
import { CustomError } from "./errors/app-error";
import { UserRole } from "@prisma/client";

function generateJwtAccessToken(res: Response, data: { userId: string, role: UserRole }) {
    try {
        // Create a payload for JWT
        const payload = {
            userId: data.userId,
            role: data.role
        }

        // Generate token
        const token = jwt.sign(
            payload, process.env.ACCESS_TOKEN_SECRET || 'My_Access_Token_Secret',
            {
                expiresIn: '5m',
            }
        );

        // Set token to cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 5 * 60 * 1000
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