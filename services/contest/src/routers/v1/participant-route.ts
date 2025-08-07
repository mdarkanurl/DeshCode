import { Router } from "express";
import { participantControllers } from "../../controllers";
const router = Router();

router.post('participants', participantControllers.createPaticipant);

export default router;