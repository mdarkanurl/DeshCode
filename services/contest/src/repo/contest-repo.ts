import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";

class ContestRepo extends CrudRepo {
    constructor() {
        super(prisma)
    }
}

export {
    ContestRepo
}