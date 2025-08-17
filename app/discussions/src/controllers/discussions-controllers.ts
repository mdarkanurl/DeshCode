import { Request, Response, NextFunction } from "express";
import { discussionsSchema } from "../schema";
import { discussionsServices } from "../services";
import { CustomError } from "../utils/errors/app-error";
import { Topic } from "../generated/prisma";

async function createDiscussions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const parseData: any = discussionsSchema.createDiscussions.safeParse(req.body);

        if(!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const discussions = await discussionsServices.createDiscussions(parseData.data);

        res.status(201).json({
            Success: true,
            Message: 'Discuss created successfully',
            Data: discussions,
            Errors: {}
        });
        return;
    } catch (error) {
        if(error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getAllDiscussions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { topic, page, limit } = req.query;

        const limitNumber = parseInt(limit as string) || 10;
        const pageNumber = parseInt(page as string) || 1;
        const skip = (pageNumber - 1) * limitNumber;
        const topicEnum = topic as Topic;
        
        if(topic && !Object.values(Topic).includes(topicEnum)) throw new CustomError('Invalid topic', 400);

        const allDiscussions = await discussionsServices.getAllDiscussions(
            {
                topic: topicEnum,
                skip: skip,
                limit: limitNumber
            }
        );

        res.status(200).json({
            Success: true,
            Message: 'All discussions fetched successfully',
            Data: allDiscussions,
            Errors: {}
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function getDiscussionsById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = req.params;

        const discussions = await discussionsServices.getDiscussionsById({ id: parseInt(id) });

        res.status(200).json({
            Success: true,
            Message: 'Discussion fetched successfully',
            Data: discussions,
            Errors: {}
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function updateDiscussions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = req.params;
        req.body.discussId = parseInt(id);
        const parseData: any = discussionsSchema.updateDiscussions.safeParse((req.body));

        if (!parseData.success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: {},
                Errors: parseData.error.errors
            });
            return;
        }

        const discussions = await discussionsServices.updateDiscussions(parseData.data);

        res.status(200).json({
            Success: true,
            Message: 'Discuss updated successfully',
            Data: discussions,
            Errors: {}
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

export {
    createDiscussions,
    getAllDiscussions,
    getDiscussionsById,
    updateDiscussions
}