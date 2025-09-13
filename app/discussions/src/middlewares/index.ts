import { islogin } from "./is-login";
import { isAdmin } from "./is-admin";

const authMiddlewares = {
    islogin,
    isAdmin
}

export {
    authMiddlewares
}