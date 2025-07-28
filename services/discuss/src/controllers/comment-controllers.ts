import { Request, Response, NextFunction } from "express";
import { commentSchema } from "../schema";
import { commentServices } from "../services";
import { CustomError } from "../utils/errors/app-error";

async function createComment(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData = commentSchema.createComment.safeParse(req.body);

        if (!parseData.success) {
           res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const comments = await commentServices.createComment(parseData.data);

        res.status(201).json({
            Success: true,
            Message: 'Comment created successfully',
            Data: comments,
            Errors: {}
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
        const { page, limit, discussId } = req.query;

        const limitNumber = parseInt(limit as string) || 5;
        const pageNumber = parseInt(page as string) || 1;
        const skip = (pageNumber - 1) * limitNumber;

        const allComments = await commentServices.getAllComments({
            discussId: parseInt(discussId as string),
            skip: skip,
            limit: limitNumber
        });

        res.status(200).json({
            Success: true,
            Message: 'Comments fetched successfully',
            Data: allComments,
            Errors: {}
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    createComment,
    getAllComments
}