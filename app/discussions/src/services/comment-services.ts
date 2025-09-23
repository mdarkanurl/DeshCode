import { CommentsRepo } from "../repo";
import { CustomError } from "../utils/errors/app-error";
const commentsRepo = new CommentsRepo();

async function createComments(data: {
    userId: string;
    discussionsId: string;
    content: string;
}) {
    try {
        const comment = await commentsRepo.create(data);
        return comment;
    } catch (error) {
        if(error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

async function getAllComments(data: {
    discussionsId: string;
    skip: number;
    limit: number;
}) {
    try {
        const whereClause: any = {
            discussionsId: data.discussionsId
        };

        const total = await commentsRepo.count({ where: whereClause });

        if (total === 0) {
            throw new CustomError('No comments found', 404);
        }

        const allDiscussions = await commentsRepo.getAllWithPagination(
            whereClause,
            {
                id: true,
                userId: true,
                discussionsId: true,
                content: true,
                createdAt: false,
                updatedAt: false,
            },
            data.skip,
            data.limit
        )

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
        if (error instanceof CustomError) throw error;
        throw new CustomError('Internal Server Error', 500);
    }
}

export {
    createComments,
    getAllComments
}