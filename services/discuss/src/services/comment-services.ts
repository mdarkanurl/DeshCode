import { CommentRepo } from "../repo";
import { CustomError } from "../utils/errors/app-error";
const commentRepo = new CommentRepo();

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

async function getAllComments(data: {
    discussId: number;
    skip: number;
    limit: number;
}) {
    try {
        const whereClause: any = {
            discussId: data.discussId
        };

        const total = await commentRepo.count({ where: whereClause });

        if (total === 0) {
            throw new CustomError('No comments found', 404);
        }

        const allDiscuss = await commentRepo.getAllWithPagination(
            whereClause,
            {
                id: true,
                userId: true,
                discussId: true,
                content: true,
                createdAt: false,
                updatedAt: false,
            },
            data.skip,
            data.limit
        )

        return {
            discussions: allDiscuss,
            pagination: {
                totalDiscussions: total,
                currentPage: Math.floor(data.skip / data.limit) + 1,
                totalPages: Math.ceil(total / data.limit),
                pageSize: data.limit
            }
        };
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

export {
    createComment,
    getAllComments
}