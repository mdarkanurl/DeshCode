import {
    signUp,
    verifyTheEmail,
    login,
    logout,
    forgetPassword,
    setForgetPassword,
    changesPassword
} from "./auth-controllers";

import {
    googleCallback
} from "./Oauth-controllers";

const authControllers = {
    signUp,
    verifyTheEmail,
    login,
    logout,
    forgetPassword,
    setForgetPassword,
    changesPassword
};

const OauthControllers = {
    googleCallback
}

export {
    authControllers,
    OauthControllers
}