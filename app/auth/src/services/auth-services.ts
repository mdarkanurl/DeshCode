import { sendVerificationCodeQueue, sendForgetPasswordCodeQueue } from "../RabbitMQ";
import e, { Response } from "express";
import { UserRepo, AuthProviderRepo } from "../repo";
import jwt from "jsonwebtoken";
import { jwtToken } from "../utils";
import { CustomError } from "../utils/errors/app-error";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { UserRole } from "@prisma/client";
dotenv.config();

const userRepo = new UserRepo();
const authProviderRepo = new AuthProviderRepo();

const signUp = async ( data: { email: string, password: string, role?: UserRole }) => {
    try {
        const isUsersAlreadyExist = await userRepo.getByEmail(data.email, true);

        if(isUsersAlreadyExist) {
            throw new CustomError('User already exist under this email', 400);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        let users;
        if(data.role && data.role === UserRole.ADMIN) {
            users = await userRepo.create({
                email: data.email,
                role: data.role
            });
        } else {
            users = await userRepo.create({
                email: data.email,
            });
        }

        // Add data to AuthProvider table
        await authProviderRepo.create({
            provider: "local",
            email: users.email,
            password: hashedPassword,
            verificationCode,
            userId: users.id
        });

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

const resendCode = async (email: string) => {
    try {
        const users = await userRepo.getByEmail(email, false);

        if(!users || !users.email) {
            throw new CustomError('No user found under this email', 400);
        }

        // Generate a verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        await authProviderRepo.updateByUserId(users.id, 
            {
                verificationCode
            }
        )

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
        await sendVerificationCodeQueue(users.email, verificationCode.toString());
        return {
            userId: users.id,
            email: users.email,
            token: tempToken
        };
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

const verifyTheEmail = async (res: Response, data: { userId: string, code: number }) => {
    try {
        const users = await userRepo.getByStringId(
            data.userId,
            false,
            {
                updatedAt: true,
                createdAt: true,
            }
        );

        if(!users) {
            throw new CustomError('No users found under this ID', 404);
        }

        const authProvider = await authProviderRepo.findByUserId(
            users.id,
            "local",
            {
                avatar: true,
                password: true,
                forgotPasswordCode: true,
                createdAt: true,
                updatedAt: true
            }
        );

        if(!authProvider || !authProvider.verificationCode) {
            throw new CustomError('Invalid user ID, no verification code found', 404);
        }

        // Match the code
        if(authProvider.verificationCode !== data.code) {
            throw new CustomError('Invalid verification code', 400);
        }

        // Update the verificationCode to unll
        await authProviderRepo.updateByUserId(
            users.id,
            {
                verificationCode: null
            }
        );

        const updateTheIsVerified = await userRepo.updateById(users.id, 
            {
                isVerified: true
            }
        );

        // Generate access and refresh tokens and set to cookies
        jwtToken.accessToken(res, { userId: users.id, role: users.role });
        jwtToken.refreshToken(res, { userId: users.id, role: users.role });

        return updateTheIsVerified;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError("Internal server error", 500);
    }
}

const login = async (res: Response, data: { email: string, password: string }) => {
    try {
        const users = await userRepo.getByEmail(
            data.email,
            true,
            {
                avatar: true,
                name: true,
                createdAt: true,
                updatedAt: true
            }
        );

        if(!users) {
            throw new CustomError('Invalid email or email is not verify yet', 400);
        }

        const authProvider = await authProviderRepo.findByUserId(
            users.id,
            "local",
            {
                verificationCode: true,
                avatar: true,
                forgotPasswordCode: true,
                providerId: true
            }
        );

        if(!authProvider || !authProvider.password) {
            throw new CustomError('Something went worng', 400);
        }

        // Check the password
        const password = await bcrypt.compare(data.password, authProvider.password);

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
        const users = await userRepo.getByEmail(data.email);

        if(!users) {
            throw new CustomError('No user found under this email or email is not verify', 404);
        }

        // Generate a forget password code
        const forgotPasswordCode = Math.floor(100000 + Math.random() * 900000);

        // Update the forget password code in DB
        await authProviderRepo.updateByUserId(
            users.id,
            {
                forgotPasswordCode: forgotPasswordCode
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
        await sendForgetPasswordCodeQueue(data.email, forgotPasswordCode.toString());

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
        const users = await userRepo.getByStringId(data.userId, true, {
            updatedAt: true,
            createdAt: true
        });

        if(!users) {
            throw new CustomError('No user found under this email', 404);
        }

        const authProvider = await authProviderRepo.findByUserId(
            users.id,
            "local",
            {
                avatar: true,
                providerId: true,
                username: true,
                password: true,
                verificationCode: true
            }
        );

        if(!authProvider || !authProvider.forgotPasswordCode) {
            throw new CustomError('Something went worng', 400);
        }

        // Match the code
        if(authProvider.forgotPasswordCode !== data.code) {
            throw new CustomError('Invalid forgot password code code', 400);
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        // Update the password
        const updatePassword = await authProviderRepo.updateById(
            authProvider.id,
            {
                password: hashedPassword,
                forgotPasswordCode: null
            },
            {
                password: true,
                verificationCode: true,
                forgotPasswordCode: true,
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
        const users = await userRepo.getByStringId(data.userId, true, {
            createdAt: true,
            updatedAt: true,
            avatar: true
        });
        
        if(!users) {
            throw new CustomError('No user found', 404);
        }

        const authProvider = await authProviderRepo.findByUserId(
            users.id,
            "local",
            {
                providerId: true,
                username: true,
                avatar: true,
                verificationCode: true,
                forgotPasswordCode: true,
            }
        );

        if(!authProvider || !authProvider.password) {
            throw new CustomError('Something went worng', 404);
        }

        // Check the password
        const isPasswordVaild = await bcrypt.compare(data.currentPassword, authProvider.password);

        if(!isPasswordVaild) {
            throw new CustomError('Invalid password', 400);
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(data.newPassword, 10);

        // Change the password
        const responses = await authProviderRepo.updateById(
            authProvider.id,
            {
                password: hashedPassword
            },
            {
                providerId: true,
                username: true,
                avatar: true,
                verificationCode: true,
                forgotPasswordCode: true,
                password: true
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
    resendCode,
    verifyTheEmail,
    login,
    logout,
    forgetPassword,
    setForgetPassword,
    changesPassword
}