import { prisma } from "../prisma";
import { CrudRepo } from "./crud-repo";

class CommentRepo extends CrudRepo {
    constructor() {
        super(prisma.comments);
    }
}

export {
    CommentRepo
}