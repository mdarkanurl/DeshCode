import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";
import { CustomError } from "../utils/errors/app-error";

class DiscussionsRepo extends CrudRepo {
    constructor() {
        super(prisma.discussions)
    }

    async getByStringId(id: string, omit?: {}) {
        try {
            return await prisma.discussions.findFirst({
                where: { id }
            });
        } catch (error) {
            throw new CustomError('Internal Server Error', 500);
        }
    }
}

export {
    DiscussionsRepo
}