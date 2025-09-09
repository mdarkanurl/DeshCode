import { Router } from "express";
const router = Router();
import { authControllers } from "../../controllers";
import { authMiddlewares } from "../../middlewares";

// Destructuring
const { signUp, verifyTheEmail, login, logout, forgetPassword } = authControllers;
const { isTempJwtTokenExists, islogin } = authMiddlewares;

router.post('/signup', signUp);
router.post('/verify-email', isTempJwtTokenExists, verifyTheEmail);
router.post('/login', login);
router.get('/logout', islogin, logout);
router.post('/forget-password', forgetPassword)

export default router;