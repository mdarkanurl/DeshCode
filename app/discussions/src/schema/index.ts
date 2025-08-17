import { createDiscussions, updateDiscussions } from "./discussions-schema";
import { createComments } from "./comments-schema";

const discussionsSchema = {
    createDiscussions,
    updateDiscussions
}

const commentsSchema = {
    createComments
}

export {
    discussionsSchema,
    commentsSchema
}