import { DiscussionsRepo } from "../repo";
import { Topic } from "@prisma/client";
import { CustomError } from "../utils/errors/app-error";
import { prisma } from "../prisma";

const discussionsRepo = new DiscussionsRepo();

async function createDiscussions(data: {
    userId: string
    topic: Topic
    title: string
    content: string
}) {
    try {
        const discussions = await discussionsRepo.create(data);
        return discussions;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function getAllDiscussions(data: {
    topic?: Topic,
    skip: number,
    limit: number
}) {
    try {
        const whereClause: any = {};

        if(data.topic != null) {
            whereClause.topic = data.topic;
        }

        const total = await prisma.discussions.count({
            where: whereClause
        });

        const allDiscussions = await prisma.discussions.findMany({
            where: whereClause,
            select: {
                id: true,
                topic: true,
                title: true,
                content: true
            },
            skip: data.skip,
            take: data.limit
        });

        if(allDiscussions.length === 0) {
            throw new CustomError('No discussions found', 404);
        }

        return {
            discussions: allDiscussions,
            pagination: {
                totalDiscussions: total,
                currentPage: Math.floor(data.skip / data.limit) + 1,
                totalPages: Math.ceil(total / data.limit),
                pageSize: data.limit
            }
        };
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function getDiscussionsById(data: {
    id: number
}) {
    try {
        const discussions = await discussionsRepo.getById(data.id);

        if (!discussions) throw new CustomError('Discussion not found', 404);
        return discussions;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function updateDiscussions(data: {
    userId: string
    id: number
    title?: string
    content?: string
}) {
    try {
        const discussions = await discussionsRepo.getById(data.id);

        if(!discussions || discussions.userId !== data.userId) {
            throw new CustomError('Access denied or discussion not found', 401)
        }

        await discussionsRepo.update(discussions.id, {
            title: data.title,
            content: data.content
        });
        
        return discussions;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

export {
    createDiscussions,
    getAllDiscussions,
    getDiscussionsById,
    updateDiscussions
}