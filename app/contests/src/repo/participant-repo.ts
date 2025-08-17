import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";

class ParticipantsRepo extends CrudRepo {
    constructor() {
        super(prisma.participants)
    }
}

export {
    ParticipantsRepo
}