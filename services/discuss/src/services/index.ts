import { createDiscuss, getAllDiscuss, getDiscussById, updateDiscuss } from "./discuss-services";
import { createComment, getAllComments } from "./comment-services";

const discussServices = {
    createDiscuss,
    getAllDiscuss,
    getDiscussById,
    updateDiscuss
}

const commentServices = {
    createComment,
    getAllComments
}

export {
    discussServices,
    commentServices
}