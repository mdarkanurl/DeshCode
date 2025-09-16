import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";
import { CustomError } from "../utils/errors/app-error";

export class UserRepo extends CrudRepo {
    constructor() {
        super(prisma.user);
    }

    async getByEmail( email: string, isVerified: boolean = true, omit?: {} ) {
        try {
            return await prisma.user.findUnique({
                where: { email, isVerified },
                omit
            });
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Internal Server Error", 500);
        }
    }

    async getByStringId(id: string, isVerified: boolean, omit?: {}) {
        try {
            return await prisma.user.findUnique({
                where: { id, isVerified },
                omit
            });
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Internal Server Error", 500);
        }
    }

    async updateById(id: string, data: {}, omit?: {}) {
        try {
            return await prisma.user.update({
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