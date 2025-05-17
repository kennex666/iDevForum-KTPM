import express, { Router } from 'express';
import { commentController } from '../controllers/commentController';
import { authenticate } from '../utils/authenticate';

const router: Router = express.Router();


/**
 * Search comments
 */
router.get('/search', commentController.searchComments);

/**
 * Get all comments
 */
router.get('/', commentController.getAllComments);

/**
 * Create new comment
 */
router.post('/save', authenticate, commentController.createComment);

/**
 * Get comments by post ID
 */
router.get('/post/:postId', commentController.getCommentsByPostId);

/**
 * Get comments by user ID
 * */
router.get('/user/:userId', commentController.getCommentsByUserId);

/**
 * Get comment by ID
 */
router.get('/:id', commentController.getCommentById);

/**
 * Update comment
 */
router.put('/:id',authenticate, commentController.updateComment);

/**
 * Delete comment
 */
router.delete('/:id',authenticate, commentController.deleteComment);

export default router;