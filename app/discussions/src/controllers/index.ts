import {
    createDiscussions,
    getAllDiscussions,
    getDiscussionsById,
    updateDiscussions,
    deleteDiscussions
} from "./discussions-controllers";

import {
    createComments,
    getAllComments
} from "./comments-controllers";

const discussionsControllers = {
    createDiscussions,
    getAllDiscussions,
    getDiscussionsById,
    updateDiscussions,
    deleteDiscussions
};

const commentsControllers = {
    createComments,
    getAllComments
};

export {
    discussionsControllers,
    commentsControllers
}