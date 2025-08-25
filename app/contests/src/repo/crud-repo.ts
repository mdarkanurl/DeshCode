import { CustomError } from "../utils/errors/app-error";

export class CrudRepo {
    private model: any;

    constructor(model: any) {
        this.model = model;
    }

    async create(data: Object) {
        try {
            return await this.model.create({
                data: { ...data }
            });
        } catch (error) {
            throw new CustomError("Failed to create record", 500);
        }
    }

    async destroy(id: number) {
        try {
            return await this.model.delete(
                {
            where: { id },
        });
        } catch (error) {
            throw new CustomError("Failed to delete records", 500);
        }
    }

    async get(id: number) {
        try {
            return await this.model.findUnique({
            where: { id },
        });
        } catch (error) {
            throw new CustomError("Failed to get record", 500);
        }
    }

    async getAll() {
        try {
            return await this.model.findMany();
        } catch (error) {
            throw new CustomError("Failed to get data from Database. Please try again", 500);
        }
    }

    async getById(id: number) {
       try {
         return await this.model.findUnique({
            where: { id }
        });
       } catch (error) {
            throw new CustomError("Failed to get data from Database. Please try again", 500);
       }
    }

    async update(id: number, data: object) {
        try {
            return await this.model.update({
                where: { id },
                data: { ...data },
            });
        } catch (error) {
            throw new CustomError("Failed to update record", 500);
        }
    }
}