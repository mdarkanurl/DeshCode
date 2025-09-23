import { Request, Response, NextFunction } from "express";
import { commentsSchema } from "../schema";
import { commentsServices } from "../services";
import { CustomError } from "../utils/errors/app-error";
import { AuthRequest } from "../types";

async function createComments(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const discussionsId: string = req.params.id;
        const userId = req.userId as string;
        const content: string = req.body.content;

        // parse data via zod
        const { error, success, data } = commentsSchema.createComments.safeParse({
            discussionsId,
            userId,
            content
        });

        if (!success) {
           res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        }

        const comments = await commentsServices.createComments({
            discussionsId: data.discussionsId,
            userId: data.userId,
            content: data.content
        });

        res.status(201).json({
            Success: true,
            Message: 'Comment created successfully',
            Data: comments,
            Errors: null
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getAllComments(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { page, limit, discussionsId } = req.query;

        const limitNumber = parseInt(limit as string) || 5;
        const pageNumber = parseInt(page as string) || 1;
        const skip = (pageNumber - 1) * limitNumber;

        const allComments = await commentsServices.getAllComments({
            discussionsId: discussionsId!.toString(),
            skip: skip,
            limit: limitNumber
        });

        res.status(200).json({
            Success: true,
            Message: 'Comments fetched successfully',
            Data: allComments,
            Errors: null
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    createComments,
    getAllComments
}