import { createDiscuss, getAllDiscuss, getDiscussById, updateDiscuss } from "./discuss-controllers";
import { createComment, getAllComments } from "./comment-controllers";

const discussControllers = {
    createDiscuss,
    getAllDiscuss,
    getDiscussById,
    updateDiscuss
};

const commentControllers = {
    createComment,
    getAllComments
};

export {
    discussControllers,
    commentControllers
}