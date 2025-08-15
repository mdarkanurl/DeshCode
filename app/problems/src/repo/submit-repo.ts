import { prisma } from "../prisma"
import { CrudRepo } from "./crud-repo"

class SubmitRepo extends CrudRepo {
    constructor() {
        super(prisma.submit)
    }
}

export {
    SubmitRepo
}