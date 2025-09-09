import { Router } from "express";
const router = Router();
import { authControllers } from "../../controllers";
import { authMiddlewares } from "../../middlewares";

// Destructuring
const { signUp, verifyTheEmail, login, logout, forgetPassword, setForgetPassword } = authControllers;
const { isTempJwtTokenExists, islogin } = authMiddlewares;

router.post('/signup', signUp);
router.post('/verify-email', isTempJwtTokenExists, verifyTheEmail);
router.post('/login', login);
router.get('/logout', islogin, logout);
router.post('/forget-password', forgetPassword);
router.put('/new-password', isTempJwtTokenExists, setForgetPassword);

export default router;