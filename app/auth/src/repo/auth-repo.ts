import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";
import { CustomError } from "../utils/errors/app-error";

export class AuthRepo extends CrudRepo {
    constructor() {
        super(prisma.users);
    }

    async getByEmail( email: string, isVerified: boolean = true, omit?: {} ) {
        try {
            return await prisma.users.findUnique({
                where: { email, isVerified },
                omit
            });
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Internal Server Error", 500);
        }
    }

    async updateById(id: string, data: {}, omit?: {}) {
        try {
            return await prisma.users.update({
                where: { id },
                data,
                omit
            });
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Internal Server Error", 500);
        }
    }
}