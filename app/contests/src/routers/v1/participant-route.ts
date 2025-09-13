import { Router } from "express";
import { participantsControllers } from "../../controllers";
const router = Router();

import { authMiddlewares } from "../../middlewares";
const { islogin, isAdmin } = authMiddlewares;

router.post('/', islogin, participantsControllers.createParticipants);
router.get('/:contestId', isAdmin, participantsControllers.getParticipantsByContestId);
router.get('/users/:userId', isAdmin, participantsControllers.getParticipantsByUserId);

export default router;