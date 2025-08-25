import { CrudRepo } from "./crud-repo";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../prisma";
import { CustomError } from "../utils/errors/app-error";

class ParticipantsRepo extends CrudRepo {
    constructor() {
        super(prisma.participants)
    }

    async createParticipant(data: { contestId: string, userId: string }) {
        try {
            const isParticipantExists = await prisma.participants.findUnique({
                where: {
                    contestId: data.contestId,
                    userId: data.userId
                }
            });

            if (isParticipantExists) {
                throw new CustomError("Participant already registered", 400);
            }

            const participants = await prisma.participants.create({
                data: { ...data }
            });

            return participants;
        } catch (error) {
            if(error instanceof CustomError) throw error;
            throw new CustomError("Failed to create record", 500);
        }
    }

    async getParticipantsByContestId (data: { contestId: string }) {
        try {
            return await prisma.participants.findMany({
                where: {
                    contestId: data.contestId
                }
            });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError("Failed to retrieve participants", 500);
        }
    }
}

export {
    ParticipantsRepo
}