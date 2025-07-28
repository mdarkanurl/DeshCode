import { CommentRepo, DiscussRepo } from "../repo";
import { CustomError } from "../utils/errors/app-error";
const commentRepo = new CommentRepo();
const discussRepo = new DiscussRepo();

async function createComment(data: {
    userId: string;
    discussId: number;
    content: string;
}) {
    try {
        const comment = await commentRepo.create(data);
        return comment;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

export {
    createComment
}