import { Response } from "express";
import { jwtToken } from "../utils";
import { CustomError } from "../utils/errors/app-error";

const googleCallback = (res: Response, data: { userId: string }) => {
    try {
        // Create JWT access token
        jwtToken.accessToken(res, {
            userId: data.userId
        });

        // Create JWT refresh token
        jwtToken.refreshToken(res, {
            userId: data.userId
        });
        return
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

const githubCallback = (res: Response, data: { userId: string }) => {
    try {
        // Create JWT access token
        jwtToken.accessToken(res, {
            userId: data.userId
        });

        // Create JWT refresh token
        jwtToken.refreshToken(res, {
            userId: data.userId
        });
        return
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

export {
    googleCallback,
    githubCallback
}