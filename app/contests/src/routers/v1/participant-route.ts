import { Router } from "express";
import { participantsControllers } from "../../controllers";
const router = Router();

router.post('/', participantsControllers.createParticipants);

export default router;