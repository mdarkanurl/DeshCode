import {
  signUp,
  resendCode,
  verifyTheEmail,
  login,
  forgetPassword,
  setForgetPassword,
  changesPassword
} from "./auth-schema";

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
};