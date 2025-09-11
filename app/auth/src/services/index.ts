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
    googleCallback
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
    googleCallback
}

export {
    authService,
    OauthService
};