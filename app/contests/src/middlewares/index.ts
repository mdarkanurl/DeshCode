import {
    CheckIsSubmissionAllow
} from './check-is-submission-allow';

import { islogin } from "./is-login";
import { isAdmin } from "./is-admin";

const submissionMiddlewares = {
    CheckIsSubmissionAllow
}

const authMiddlewares = {
    islogin,
    isAdmin
}

export {
    submissionMiddlewares,
    authMiddlewares
}