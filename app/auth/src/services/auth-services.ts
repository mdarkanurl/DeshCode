import { sendVerificationCodeQueue } from "../RabbitMQ";
import { Response } from "express";
import { AuthRepo } from "../repo";
import { jwtToken } from "../utils";
import { CustomError } from "../utils/errors/app-error";
import bcrypt from "bcryptjs";

const authRepo = new AuthRepo();

const signUp = async (res: Response, data: { email: string, password: string }) => {
    try {
        const isUsersAlreadyExist = await authRepo.getByEmail(data.email, true);

        if(isUsersAlreadyExist) {
            throw new CustomError('User already exist under this email', 400);
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(data.password, 10);

        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Save the users to Database
        const users = await authRepo.create({
            email: data.email,
            password: hashPassword,
            verificationCode: verificationCode.toString()
        });

        // Generate JWT token and set it into cookie
        jwtToken.accessToken(res, {
            email: data.email,
            isVerified: false
        });

        jwtToken.refreshToken(res, {
            email: data.email,
            isVerified: false
        });

        // Send verification code to email
        await sendVerificationCodeQueue(data.email, verificationCode.toString());
        return users;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500)
    }
}

const verifyTheEmail = async (data: { email: string, code: number }) => {
    try {
        const users = await authRepo.getByEmail(data.email);

        if(!users) {
            throw new CustomError('No users found under this email', 404);
        }

        // Match the code
        if(users.verificationCode !== data.code) {
            throw new CustomError('Invalid verification code', 400);
        }

        // Update the isVerified
        const updateIsVerified = await authRepo.updateById(
            users.id,
            {
                code: data.code
            },
            {
                password: false,
                updatedAt: false,
                createdAt: false
            }
        );

        return updateIsVerified;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

export {
    signUp,
    verifyTheEmail
}