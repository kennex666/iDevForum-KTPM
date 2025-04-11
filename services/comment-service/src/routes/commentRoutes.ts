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
router.get('/comment/:id', commentController.getCommentById);

/**
 * Update comment
 */
router.put('/comment/:id', commentController.updateComment);

/**
 * Delete comment
 */
router.delete('/comment/:id', commentController.deleteComment);

/**
 * Search comments
 */
router.get('/search', commentController.searchComments);

export default router;