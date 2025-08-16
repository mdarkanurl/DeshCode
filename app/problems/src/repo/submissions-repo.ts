import { prisma } from "../prisma"
import { CrudRepo } from "./crud-repo"

class SubmissionsRepo extends CrudRepo {
    constructor() {
        super(prisma.submissions)
    }
}

export {
    SubmissionsRepo
}