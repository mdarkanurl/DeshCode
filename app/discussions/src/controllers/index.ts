import {
    createDiscussions,
    getAllDiscussions,
    getDiscussionsById,
    updateDiscussions
} from "./discussions-controllers";

import {
    createComments,
    getAllComments
} from "./comments-controllers";

const discussionsControllers = {
    createDiscussions,
    getAllDiscussions,
    getDiscussionsById,
    updateDiscussions
};

const commentsControllers = {
    createComments,
    getAllComments
};

export {
    discussionsControllers,
    commentsControllers
}