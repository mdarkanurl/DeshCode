import { Request, Response, NextFunction } from "express";
import { discussSchema } from "../schema";
import { discussServices } from "../services";
import { CustomError } from "../utils/errors/app-error";
import { Topic } from "../generated/prisma";

async function createDiscuss(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData: any = discussSchema.createDiscuss.safeParse(req.body);

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const discuss = discussServices.createDiscuss(req.body);

        res.status(201).json({
            Success: true,
            Message: 'Discuss created successfully',
            Data: discuss,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getAllDiscuss(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { topic, page, limit } = req.query;

        const limitNumber = parseInt(limit as string) || 10;
        const pageNumber = parseInt(page as string) || 1;
        const skip = (pageNumber - 1) * limitNumber;
        if (typeof topic !== 'string' || !(topic in Topic)) {
            throw new Error("Invalid topic");
        }
        const topicEnum = topic as Topic;

        const allDiscuss = await discussServices.getAllDiscuss(
            {
                topic: topicEnum,
                skip: skip,
                limit: limitNumber
            }
        );

        res.status(200).json({
            Success: true,
            Message: 'All Discuss fetched successfully',
            Data: allDiscuss,
            Errors: {}
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getDiscussById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = req.params;

        const discuss = await discussServices.getDiscussById({ id: parseInt(id) });

        res.status(200).json({
            Success: true,
            Message: 'Discuss fetched successfully',
            Data: discuss,
            Errors: {}
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function updateDiscuss(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = req.params;
        const parseData: any = discussSchema.updateDiscuss.safeParse((req.body, { id: parseInt(id) }));

        if (!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const discuss = await discussServices.updateDiscuss({ id: parseInt(id), ...req.body });

        res.status(200).json({
            Success: true,
            Message: 'Discuss updated successfully',
            Data: discuss,
            Errors: {}
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    createDiscuss,
    getAllDiscuss,
    getDiscussById,
    updateDiscuss
}