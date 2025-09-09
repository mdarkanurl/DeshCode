import { Router } from "express";
const router = Router();
import { authControllers } from "../../controllers";
import { authMiddlewares } from "../../middlewares";

// Destructuring
const { signUp, verifyTheEmail, login, logout } = authControllers;
const { isTempJwtTokenExists, islogin } = authMiddlewares;

router.post('/signup', signUp);
router.post('/verify-email', isTempJwtTokenExists, verifyTheEmail);
router.post('/login', login);
router.get('/logout', islogin, logout);

export default router;