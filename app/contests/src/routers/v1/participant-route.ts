import { Router } from "express";
import { participantControllers } from "../../controllers";
const router = Router();

router.post('/', participantControllers.createParticipant);

export default router;