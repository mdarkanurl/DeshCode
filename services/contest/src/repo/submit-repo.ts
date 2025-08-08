import { CrudRepo } from "./crud-repo";
import { prisma } from "../prisma";

class SubmitRepo extends CrudRepo {
    constructor() {
        super(prisma.submitData)
    }
}

export {
    SubmitRepo
}