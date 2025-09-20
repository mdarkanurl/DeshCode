import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";
import { CustomError } from "../utils/errors/app-error";

class DiscussionsRepo extends CrudRepo {
    constructor() {
        super(prisma.discussions)
    }

    async getByStringId(id: string, omit?: {}) {
        try {
            console.log("ID: ", id);
            const x = await prisma.discussions.findFirst({
                where: { id: id }
            });
            console.log(x);
            return x;
        } catch (error) {
            throw new CustomError('Internal Server Error', 500);
        }
    }

    async updateById(id: string, data: Object, omit?: {}) {
        try {
            return await prisma.discussions.update({
                where: { id },
                data,
                omit
            });
        } catch (error) {
            throw new CustomError('Internal Server Error', 500);
        }
    }

    async destroyById(id: string, omit?: {}) {
        try {
            return await prisma.discussions.delete({
                where: { id },
                omit
            });
        } catch (error) {
            throw new CustomError('Internal Server Error', 500);
        }
    }
}

export {
    DiscussionsRepo
}