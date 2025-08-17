import { prisma } from "../prisma";
import { CustomError } from "../utils/errors/app-error";
import { CrudRepo } from "./crud-repo";

class CommentsRepo extends CrudRepo {
    constructor() {
        super(prisma.comments);
    }

    async count(data: { where: Object }) {
        try {
            return await prisma.comments.count({
                where: data.where
            });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError('Internal Server Error', 500);
        }
    }

    async getAllWithPagination(
        whereClause: Object,
        select: Object,
        skip: number,
        take: number
    ) {
        try {
            return await prisma.comments.findMany({
                where: whereClause,
                select: select,
                skip: skip,
                take: take
            });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError('Internal Server Error', 500);
        }
    }
}

export {
    CommentsRepo
}