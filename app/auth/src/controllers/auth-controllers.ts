import { Request, Response, NextFunction } from "express";
import { authSchemas } from "../schema";
import { authService } from "../services";
import { CustomError } from "../utils/errors/app-error";

interface AuthRequest extends Request {
  userId?: string;
}

const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { error, success, data } = authSchemas.signUp.safeParse(req.body);

        if(!success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        }

        const users = await authService.signUp(res, {
            email: data.email,
            password: data.password
        });

        res.status(201).json({
            Success: true,
            Message: `User successfully created with this email ${data.email}`,
            Data: users,
            Errors: null
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

const verifyTheEmail = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const code = parseInt(req?.body?.code);
        const { userId } = req;

        const { error, success, data } = authSchemas.verifyTheEmail.safeParse({ userId, code });

        if(!success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        }

        const updateUsers = await authService.verifyTheEmail({
            userId: data.userId,
            code: data.code
        });

        res.status(200).json({
            Success: true,
            Message: `Successfully verifyed this email ${updateUsers.email}`,
            Data: updateUsers,
            Errors: null
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

const login = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { error, success, data } = authSchemas.login.safeParse(req.body);

        if(!success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        }

        const users = await authService.login(res, {
            email: data.email,
            password: data.password
        });

        res.status(200).json({
            Success: true,
            Message: `Successfully login with this email ${users.email}`,
            Data: users,
            Errors: null
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

const logout = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        await authService.logout(res);

        res.status(200).json({
            Success: true,
            Message: `Logout successful`,
            Data: null,
            Errors: null
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

const forgetPassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { error, success, data } = authSchemas.forgetPassword.safeParse(req.body);

        if(!success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        }

        const responses = await authService.forgetPassword({ email: data.email });

        res.status(200).json({
            Success: true,
            Message: `Check your email and verify that it's you`,
            Data: responses,
            Errors: null
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

const setForgetPassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { code, newPassword } = req.body;
        const { userId } = req;

        const { error, success, data } = authSchemas.setForgetPassword.safeParse({ code, newPassword, userId });

        if(!success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        }

        const responses = await authService.setForgetPassword({
            userId: data.userId,
            code: data.code,
            newPassword: data.newPassword
        });

        res.status(200).json({
            Success: true,
            Message: `Your new password successfully set`,
            Data: responses,
            Errors: null
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

const changesPassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req;
        const { currentPassword, newPassword } = req.body;

        const { error, success, data } = authSchemas.changesPassword.safeParse({ userId, currentPassword, newPassword });

        if(!success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        }

        const responses = await authService.changesPassword({
            userId: data.userId,
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        });

        res.status(200).json({
            Success: true,
            Message: `Your new password successfully set`,
            Data: responses,
            Errors: null
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
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