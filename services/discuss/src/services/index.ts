import { createDiscuss, getAllDiscuss, getDiscussById, updateDiscuss } from "./discuss-services";
import { createComment } from "./comment-services";

const discussServices = {
    createDiscuss,
    getAllDiscuss,
    getDiscussById,
    updateDiscuss
}

const commentServices = {
    createComment
}

export {
    discussServices,
    commentServices
}