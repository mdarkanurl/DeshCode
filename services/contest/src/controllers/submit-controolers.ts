import { Request, Response, NextFunction } from "express";
import { submitService } from "../services";
import { submitSchema } from "../schema";
import { CustomError } from "../utils/errors/app-error";


async function submitSolution(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData = submitSchema.submitSolution.safeParse({ id: (req.params.id) });

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const submit = await submitService.submitSolution(parseData.data);

        res.status(200).json({
            Success: true,
            Message: 'Solution submitted successfully',
            Data: submit,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    submitSolution
}