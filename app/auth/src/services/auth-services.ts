import { sendVerificationCodeQueue } from "../RabbitMQ";
import { Response } from "express";
import { AuthRepo } from "../repo";
import jwt from "jsonwebtoken";
import { jwtToken } from "../utils";
import { CustomError } from "../utils/errors/app-error";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { UserRole } from "@prisma/client";
dotenv.config({ path: '../../.env' });

const authRepo = new AuthRepo();

const signUp = async (res: Response, data: { email: string, password: string, role?: UserRole }) => {
    try {
        const isUsersAlreadyExist = await authRepo.getByEmail(data.email, true);

        if(isUsersAlreadyExist) {
            throw new CustomError('User already exist under this email', 400);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        let users;
        if(data.role && data.role === UserRole.ADMIN) {
            // Save the admin to Database
            users = await authRepo.create({
                email: data.email,
                password: hashedPassword,
                verificationCode: verificationCode,
                role: data.role
            });
        } else {
            // Save the users to Database
            users = await authRepo.create({
                email: data.email,
                password: hashedPassword,
                verificationCode: verificationCode
            });
        }

        // Payload for jwt token
        const payload = {
            userId: users.id
        }

        // Generate JWT token and send to client
        const tempToken = jwt.sign(
            payload,
            process.env.TEMP_JWT_TOKEN || 'Temp-Secret-JWT-Token',
            {
                expiresIn: '5m',
            }
        );

        // Send verification code to email
        await sendVerificationCodeQueue(data.email, verificationCode.toString());
        return {
            userId: users.id,
            email: users.email,
            token: tempToken
        };
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500)
    }
}

const verifyTheEmail = async (res: Response, data: { userId: string, code: number }) => {
    try {
        const users = await authRepo.getByStringId(
            data.userId,
            {
                updatedAt: true,
                createdAt: true,
                password: true
            }
        );

        if(!users) {
            throw new CustomError('No users found under this ID', 404);
        }

        // Match the code
        if(users.verificationCode !== data.code) {
            throw new CustomError('Invalid verification code', 400);
        }

        // Update the isVerified
        const updateIsVerified = await authRepo.updateById(
            users.id,
            {
                verificationCode: null,
                isVerified: true
            },
            {
                password: true,
                updatedAt: true,
                createdAt: true
            }
        );

        // Generate access and refresh tokens and set to cookies
        jwtToken.accessToken(res, { userId: users.id, role: users.role });
        jwtToken.refreshToken(res, { userId: users.id, role: users.role });

        return updateIsVerified;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

const login = async (res: Response, data: { email: string, password: string }) => {
    try {
        const users = await authRepo.getByEmail(
            data.email,
            true,
            {
                createdAt: true,
                updatedAt: true,
                verificationCode: true
            }
        );

        if(!users) {
            throw new CustomError('Invalid email or email is not verify yet', 400);
        }

        // Check the password
        const password = await bcrypt.compare(data.password, users.password);

        if(!password) {
            throw new CustomError('Invalid password', 400);
        }

        // Generate JWT token and set it into cookie
        jwtToken.accessToken(res, {
            userId: users.id,
            role: users.role
        });

        jwtToken.refreshToken(res, {
            userId: users.id,
            role: users.role
        });

        return {
            id: users.id,
            email: users.email,
            isVerified: true,
            role: users.role
        };
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

const logout = async (res: Response) => {
    try {
        // Clear the cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

const forgetPassword = async (data: { email: string }) => {
    try {
        // Get the user from DB
        const users = await authRepo.getByEmail(data.email);

        if(!users) {
            throw new CustomError('No user found under this email', 404);
        }

        // Generate a verification code
        const forgotPasswordCode = Math.floor(100000 + Math.random() * 900000);

        // Update the verification code in DB
        await authRepo.updateById(
            users.id,
            {
                forgotPasswordCode: forgotPasswordCode.toString()
            },
            {
                password: true,
                updatedAt: true,
                createdAt: true
            }
        );

        // Payload for jwt token
        const payload = {
            userId: users.id
        }

        // Generate JWT token and send to client
        const tempToken = jwt.sign(
            payload,
            process.env.TEMP_JWT_TOKEN || 'Temp-Secret-JWT-Token',
            {
                expiresIn: '5m',
            }
        );

        // Send verification code to email
        await sendVerificationCodeQueue(data.email, forgotPasswordCode.toString());

        return {
            email: users.email,
            message: `DeshCode sent code to ${users.email}`,
            tempToken
        };
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500)
    }
}

const setForgetPassword = async (data: { userId: string, code: number, newPassword: string }) => {
    try {
        // Get the user from DB
        const users = await authRepo.getByStringId(data.userId, {
            updatedAt: true,
            createdAt: true
        });

        if(!users) {
            throw new CustomError('No user found under this email', 404);
        }

        // Match the code
        if(users.forgotPasswordCode !== data.code) {
            throw new CustomError('Invalid forgot password code code', 400);
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        // Update the password
        const updatePassword = await authRepo.updateById(
            users.id,
            {
                password: hashedPassword,
                forgotPasswordCode: null
            },
            {
                password: true,
                updatedAt: true,
                createdAt: true
            }
        );

        return updatePassword;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

const changesPassword = async (data: { userId: string, currentPassword: string, newPassword: string }) => {
    try {
        // Find the user from DB
        const users = await authRepo.getByStringId(data.userId, {
            createdAt: true,
            updatedAt: true
        });
        
        if(!users) {
            throw new CustomError('No user found', 404);
        }

        // Check the password
        const isPasswordVaild = await bcrypt.compare(data.currentPassword, users.password);

        if(!isPasswordVaild) {
            throw new CustomError('Invalid password', 400);
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        // Change the password
        const responses = await authRepo.updateById(
            users.id,
            {
                password: hashedPassword
            },
            {
                verificationCode: true,
                forgotPasswordCode: true,
                createdAt: true,
                updatedAt: true
            }
        );

        return responses;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

export {
    signUp,
    verifyTheEmail,
    login,
    logout,
    forgetPassword,
    setForgetPassword,
    changesPassword
}