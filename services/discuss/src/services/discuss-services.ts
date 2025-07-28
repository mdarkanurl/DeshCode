import { DiscussRepo } from "../repo";
import { Topic } from "../generated/prisma";
import { CustomError } from "../utils/errors/app-error";
import { prisma } from "../prisma";

const discussRepo = new DiscussRepo();

async function createDiscuss(data: {
    userId: string
    topic: Topic
    title: string
    content: string
}) {
    try {
        const discuss = await discussRepo.create(data);
        return discuss;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function getAllDiscuss(data: {
    topic?: Topic,
    skip: number,
    limit: number
}) {
    try {
        const whereClause: any = {};

        if(data.topic != null) {
            whereClause.topic = data.topic;
        }

        const allDiscuss = await prisma.discuss.findMany({
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
        return allDiscuss;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function getDiscussById(data: {
    id: number
}) {
    try {
        const discuss = await discussRepo.getById(data.id);

        if (!discuss) throw new CustomError('Discuss not found', 404);
        return discuss;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function updateDiscuss(data: {
    id: number
    title?: string
    content?: string
}) {
    try {
        const discuss = await discussRepo.update(data.id, {
            title: data.title,
            content: data.content
        });

        if (!discuss) {
            const isDiscussExists = await discussRepo.getById(data.id);
            if (!isDiscussExists) throw new CustomError('Discuss not found', 404);
        }
        return discuss;
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

export {
    createDiscuss,
    getAllDiscuss,
    getDiscussById,
    updateDiscuss
}