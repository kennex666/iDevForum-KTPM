import express, { Router } from 'express';
import { commentController } from '../controllers/commentController';

const router: Router = express.Router();

/**
 * Get all comments
 */
router.get('/', commentController.getAllComments);

/**
 * Create new comment
 */
router.post('/save', commentController.createComment);

/**
 * Get comment by ID
 */
router.get('/:id', commentController.getCommentById);

/**
 * Get comments by post ID
 */
router.get('/post/:postId', commentController.getCommentsByPostId);

/**
 * Get comments by user ID
 * */
router.get('/user/:userId', commentController.getCommentsByUserId);

/**
 * Update comment
 */
router.put('/:id', commentController.updateComment);

/**
 * Delete comment
 */
router.delete('/:id', commentController.deleteComment);

/**
 * Search comments
 */
router.get('/search', commentController.searchComments);

export default router;