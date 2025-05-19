import express, { Router } from 'express';
import { reactionController } from '../controllers/reactionController';
import { authenticate } from '../utils/authenticate';

const router: Router = express.Router();

router.get('/:id', reactionController.getReactionByCommentId);
router.post('/action/downvote', authenticate, reactionController.downvoteComment);
router.post('/action/upvote', authenticate, reactionController.upvoteComment);


export default router;