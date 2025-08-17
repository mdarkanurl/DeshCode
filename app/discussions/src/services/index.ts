import {
    createDiscussions,
    getAllDiscussions,
    getDiscussionsById,
    updateDiscussions
} from "./discussions-services";

import {
    createComments,
    getAllComments
} from "./comment-services";

const discussionsServices = {
    createDiscussions,
    getAllDiscussions,
    getDiscussionsById,
    updateDiscussions
}

const commentsServices = {
    createComments,
    getAllComments
}

export {
    discussionsServices,
    commentsServices
}