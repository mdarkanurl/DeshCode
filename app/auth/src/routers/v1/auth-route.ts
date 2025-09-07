import { Router } from "express";
const router = Router();
import { authControllers } from "../../controllers";
import { middlewares } from "../../middlewares";

// Destructuring
const { signUp, verifyTheEmail, login } = authControllers;
const { isJwtTokenExists } = middlewares;

router.post('/signup', signUp);
router.post('/verify-email', isJwtTokenExists, verifyTheEmail);
router.post('/login', login);

export default router;