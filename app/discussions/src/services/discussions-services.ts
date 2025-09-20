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
        return await discussionsRepo.create(data);
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
    id: string
}) {
    try {
        const discussions = await discussionsRepo.getByStringId(data.id);

        if (!discussions) {
            throw new CustomError('Discussion not found', 404)
        };
        
        return discussions;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function updateDiscussions(data: {
    userId: string
    id: string
    title?: string
    content?: string
}) {
    try {
        // Find the discussion
        const discussions = await discussionsRepo.getByStringId(data.id);

        if(!discussions) {
            throw new CustomError('Discussion not found', 404)
        }

        if(data.userId !== discussions.userId) {
            throw new CustomError('Unauthorized to update this discussion', 401)
        }

        // Update the discussion
        const updatedDiscussion = await discussionsRepo.updateById(discussions.id, {
            title: data.title,
            content: data.content
        });
        
        return updatedDiscussion;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function deleteDiscussions(data: {
    userId: string
    id: string
}) {
    try {
        // Find the discussion
        const discussions = await discussionsRepo.getByStringId(data.id);

        if(!discussions) {
            throw new CustomError('Discussion not found', 404);
        }

        if(data.userId !== discussions.userId) {
            throw new CustomError('Unauthorized to update this discussion', 401)
        }

        // Delete the discussion
        const res = await discussionsRepo.destroyById(data.id);

        if(!res) {
            throw new CustomError('Failed to delete the discussion', 500);
        }
        return res;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

export {
    createDiscussions,
    getAllDiscussions,
    getDiscussionsById,
    updateDiscussions,
    deleteDiscussions
}