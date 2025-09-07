import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";
import { CustomError } from "../utils/errors/app-error";

export class AuthRepo extends CrudRepo {
    constructor() {
        super(prisma.users);
    }

    async getByEmail( email: string, isVerified: boolean = true ) {
        try {
            return await prisma.users.findUnique({
                where: { email, isVerified }
            });
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Failed to fetch contest data", 500);
        }
    }
}