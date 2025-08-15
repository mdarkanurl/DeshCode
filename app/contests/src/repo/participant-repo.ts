import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";

class ParticipantRepo extends CrudRepo {
    constructor() {
        super(prisma.participant)
    }
}

export {
    ParticipantRepo
}