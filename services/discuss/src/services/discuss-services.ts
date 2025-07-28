import { DiscussRepo } from "../repo";
import { Topic } from "../generated/prisma";
import { CustomError } from "../utils/errors/app-error";

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

export {
    createDiscuss
}