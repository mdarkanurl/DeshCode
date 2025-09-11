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
    googleCallback,
    githubCallback
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
    googleCallback,
    githubCallback
}

export {
    authControllers,
    OauthControllers
}