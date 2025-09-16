import {
  signUp,
  resendCode,
  verifyTheEmail,
  login,
  forgetPassword,
  setForgetPassword,
  changesPassword
} from "./auth-schema";

import { OauthSchema } from "./Oauth-schema";

const authSchemas = {
  signUp,
  resendCode,
  verifyTheEmail,
  login,
  forgetPassword,
  setForgetPassword,
  changesPassword
};

export {
    authSchemas,
    OauthSchema
};