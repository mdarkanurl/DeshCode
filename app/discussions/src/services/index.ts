import {
    createDiscussions,
    getAllDiscussions,
    getDiscussionsById,
    updateDiscussions,
    deleteDiscussions
} from "./discussions-services";

import {
    createComments,
    getAllComments
} from "./comment-services";

const discussionsServices = {
    createDiscussions,
    getAllDiscussions,
    getDiscussionsById,
    updateDiscussions,
    deleteDiscussions
}

const commentsServices = {
    createComments,
    getAllComments
}

export {
    discussionsServices,
    commentsServices
}