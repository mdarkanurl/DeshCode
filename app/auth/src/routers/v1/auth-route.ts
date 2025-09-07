import { Router } from "express";
const router = Router();
import { authControllers } from "../../controllers";
import { middlewares } from "../../middlewares";

// Destructuring
const { signUp, verifyTheEmail } = authControllers;
const { isJwtTokenExists } = middlewares;

router.post('/signup', signUp);
router.post('/verify-email', isJwtTokenExists, verifyTheEmail);

export default router;