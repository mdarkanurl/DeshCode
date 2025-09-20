import { Request, Response, NextFunction } from "express";
import { discussionsSchema } from "../schema";
import { discussionsServices } from "../services";
import { CustomError } from "../utils/errors/app-error";
import { Topic } from "@prisma/client";
import { AuthRequest } from "../types";

async function createDiscussions(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.userId as string;

        const { error, success, data } = discussionsSchema.createDiscussions.safeParse({
            userId,
            topic: req.body.topic,
            title: req.body.title,
            content: req.body.content
        });

        if(!success) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error.errors
            });
            return;
        }

        const discussions = await discussionsServices.createDiscussions({
            userId: data.userId,
            topic: data.topic as Topic,
            title: data.title,
            content: data.content
        });

        res.status(201).json({
            Success: true,
            Message: 'Discuss created successfully',
            Data: discussions,
            Errors: null
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
        
        if(topic && !Object.values(Topic).includes(topicEnum)) {
            throw new CustomError('Invalid topic', 400);
        }

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
            Errors: null
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

        if(!id || typeof id !== "string") {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: "Discussion ID missing or invalid type"
            });
            return;
        }

        const discussions = await discussionsServices.getDiscussionsById({ id });

        res.status(200).json({
            Success: true,
            Message: 'Discussion fetched successfully',
            Data: discussions,
            Errors: null
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function updateDiscussions(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = req.params;
        const userId = req.userId as string;

        const { error, success, data } = discussionsSchema.updateDiscussions.safeParse({
            userId,
            discussionsId: id,
            title: req.body.title,
            content: req.body.content
        });

        if (!success || Object.keys(req.body).length === 0) {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: error?.errors
            });
            return;
        }

        const discussions = await discussionsServices.updateDiscussions({
            userId: data.userId,
            id: data.discussionsId,
            title: data.title,
            content: data.content
        });

        res.status(200).json({
            Success: true,
            Message: 'Discuss updated successfully',
            Data: discussions,
            Errors: null
        });
        return;
    } catch (error) {
        if (error instanceof CustomError) return next(error);
        return next(new CustomError('Internal Server Error', 500));
    }
}

async function deleteDiscussions(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const userId = req.userId;
        const id = req.params.id;

        if(!userId || !id || typeof id !== "string") {
            res.status(400).json({
                Success: false,
                Message: 'Invalid input',
                Data: null,
                Errors: null
            });
            return;
        }

        const responses = await discussionsServices.deleteDiscussions({
            userId: userId.toString(),
            id
        });

        res.status(200).json({
            Success: true,
            Message: 'Discuss deleted successfully',
            Data: responses,
            Errors: null
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
    updateDiscussions,
    deleteDiscussions
}