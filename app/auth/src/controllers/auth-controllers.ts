import { Request, Response, NextFunction } from "express";
import { authSchemas } from "../schema";
import { AuthService } from "../services";
import { CustomError } from "../utils/errors/app-error";

interface AuthRequest extends Request {
  email?: string;
  isVerified?: boolean;
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

        const users = await AuthService.signUp(res, {
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
        const code = parseInt(req.body.code);
        const { email } = req;

        const { error, success, data } = authSchemas.verifyTheEmail.safeParse({ email, code });

        if(!success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        }

        const updateUsers = await AuthService.verifyTheEmail({
            email: data.email,
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
        next(new CustomError('Internal Server Error', 500));
        return;
    }
}

export {
    signUp,
    verifyTheEmail
}