import { createDiscuss, updateDiscuss } from "./discuss-schema";
import { createComment } from "./comment-schema";

const discussSchema = {
    createDiscuss,
    updateDiscuss
}

const commentSchema = {
    createComment
}

export {
    discussSchema,
    commentSchema
}