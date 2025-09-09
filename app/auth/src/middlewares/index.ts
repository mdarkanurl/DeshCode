import {
    isTempJwtTokenExists
} from ".//is-temp-token-exists";

import {
    islogin
} from "./is-login";

const authMiddlewares = {
    isTempJwtTokenExists,
    islogin
};

export { authMiddlewares };