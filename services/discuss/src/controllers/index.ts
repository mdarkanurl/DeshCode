import { createDiscuss, getAllDiscuss, getDiscussById, updateDiscuss } from "./discuss-controllers";
import { createComment } from "./comment-controllers";

const discussControllers = {
    createDiscuss,
    getAllDiscuss,
    getDiscussById,
    updateDiscuss
};

const commentControllers = {
    createComment
};

export {
    discussControllers,
    commentControllers
}