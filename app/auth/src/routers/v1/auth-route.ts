import { Router } from "express";
const router = Router();
import { authControllers } from "../../controllers";

router.post('/signup', authControllers.signUp);

export default router;