import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";

class SubmissionsRepo extends CrudRepo {
    constructor() {
        super(prisma.submissions)
    }
}

export {
    SubmissionsRepo
}