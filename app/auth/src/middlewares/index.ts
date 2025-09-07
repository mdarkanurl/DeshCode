import {
    isJwtTokenExists
} from "./is-jwt-token-exists";

import {
    islogin
} from "./is-login";

const authMiddlewares = {
    isJwtTokenExists,
    islogin
};

export { authMiddlewares };