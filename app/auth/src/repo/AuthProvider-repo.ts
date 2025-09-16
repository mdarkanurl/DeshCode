import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";
import { Provider } from "@prisma/client";
import { CustomError } from "../utils/errors/app-error";

export class AuthProviderRepo extends CrudRepo {
    constructor() {
        super(prisma.authProvider);
    }

    async findByUserId(userId: string, provider: Provider, omit?: {}) {
        try {
            return await prisma.authProvider.findFirst({
                where: { userId, provider },
                omit
            });
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Internal Server Error", 500);
        }
    }

    async updateByUserId(userId: string, data: {}, omit?: {}) {
        try {
            return await prisma.authProvider.updateMany({
                where: { userId: userId },
                data
            });
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Internal Server Error", 500);
        }
    }

    async updateById(id: string, data: {}, omit?: {}) {
        try {
            return await prisma.authProvider.update({
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