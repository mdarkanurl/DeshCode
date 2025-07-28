import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";

class DiscussRepo extends CrudRepo {
    constructor() {
        super(prisma.discuss)
    }
}

export {
    DiscussRepo
}