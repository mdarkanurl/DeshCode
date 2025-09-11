import {
    signUp,
    verifyTheEmail,
    login,
    logout,
    forgetPassword,
    setForgetPassword,
    changesPassword
} from "./auth-services";

import {
    googleCallback,
    githubCallback
} from "./Oauth-services";

const authService = {
    signUp,
    verifyTheEmail,
    login,
    logout,
    forgetPassword,
    setForgetPassword,
    changesPassword
}

const OauthService = {
    googleCallback,
    githubCallback
}

export {
    authService,
    OauthService
};