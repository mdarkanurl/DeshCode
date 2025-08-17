import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";

class DiscussionsRepo extends CrudRepo {
    constructor() {
        super(prisma.discussions)
    }
}

export {
    DiscussionsRepo
}