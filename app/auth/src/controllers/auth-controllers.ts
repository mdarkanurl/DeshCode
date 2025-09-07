import { Request, Response, NextFunction } from "express";
import { authSchemas } from "../schema";
import { AuthService } from "../services";
import { CustomError } from "../utils/errors/app-error";

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

        const users = await AuthService.signUp({
            email: data.email,
            password: data.password
        });

        res.status(400).json({
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

export {
    signUp
}