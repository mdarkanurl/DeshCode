import { Router } from "express";
import { participantsControllers } from "../../controllers";
const router = Router();

router.post('/', participantsControllers.createParticipants);
router.get('/:contestId', participantsControllers.getParticipantsByContestId);
router.get('/users/:userId', participantsControllers.getParticipantsByUserId);

export default router;