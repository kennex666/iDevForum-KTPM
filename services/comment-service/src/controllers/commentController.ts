import { Request, Response } from 'express';
import { commentService } from '../services/commentService';
import { validateId, validateCommentInput } from '../middlewares/validators';

/**
 * Response interface for consistent API responses
 */
interface ApiResponse<T> {
  errorCode: number;
  errorMessage: string;
  data: T | null;
}

/**
 * Create success response
 */
const createSuccessResponse = <T>(data: T, message: string, code: number = 200): ApiResponse<T> => ({
  errorCode: code,
  errorMessage: message,
  data
});

/**
 * Create error response
 */
const createErrorResponse = (message: string, code: number = 400): ApiResponse<null> => ({
  errorCode: code,
  errorMessage: message,
  data: null
});

/**
 * Comment controller class
 */
class CommentController {
  /**
   * Get all comments
   */
  async getAllComments(req: Request, res: Response): Promise<void> {
    try {
      const comments = await commentService.getAllComments();
      res.status(200).json(createSuccessResponse(comments, 'Lấy danh sách bình luận thành công'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi không xác định';
      res.status(200).json(createErrorResponse(message));
    }
  }

  /**
   * Create new comment
   */
  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { postId, userId, content } = req.body;
      
      // Validate input
      const validationError = validateCommentInput({ postId, userId, content });
      if (validationError) {
        res.status(200).json(createErrorResponse(validationError));
        return;
      }

      const comment = await commentService.createComment({ postId, userId, content });
      res.status(200).json(createSuccessResponse(comment, 'Tạo bình luận thành công', 201));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi không xác định';
      res.status(200).json(createErrorResponse(message));
    }
  }

  /**
   * Get comment by ID
   */
  async getCommentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Validate ID format
      if (!validateId(id)) {
        res.status(200).json(createErrorResponse('ID không hợp lệ'));
        return;
      }

      const comment = await commentService.getCommentById(id);
      if (!comment) {
        res.status(200).json(createErrorResponse('Không tìm thấy bình luận', 404));
        return;
      }

      res.status(200).json(createSuccessResponse(comment, 'Lấy bình luận thành công'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi không xác định';
      res.status(200).json(createErrorResponse(message));
    }
  }

  /**
   * Update comment
   */
  async updateComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { content } = req.body;

      // Validate ID format
      if (!validateId(id)) {
        res.status(200).json(createErrorResponse('ID không hợp lệ'));
        return;
      }

      // Validate content
      if (!content || content.trim().length === 0) {
        res.status(200).json(createErrorResponse('Vui lòng nhập nội dung bình luận'));
        return;
      }

      const updatedComment = await commentService.updateComment(id, content);
      if (!updatedComment) {
        res.status(200).json(createErrorResponse('Không tìm thấy bình luận', 404));
        return;
      }

      res.status(200).json(createSuccessResponse(updatedComment, 'Cập nhật bình luận thành công'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi không xác định';
      res.status(200).json(createErrorResponse(message));
    }
  }

  /**
   * Delete comment
   */
  async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validate ID format
      if (!validateId(id)) {
        res.status(200).json(createErrorResponse('ID không hợp lệ'));
        return;
      }

      const isDeleted = await commentService.deleteComment(id);
      if (!isDeleted) {
        res.status(200).json(createErrorResponse('Không tìm thấy bình luận', 404));
        return;
      }

      res.status(200).json(createSuccessResponse(true, 'Xóa bình luận thành công'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi không xác định';
      res.status(200).json(createErrorResponse(message));
    }
  }

  /**
   * Search comments
   */
  async searchComments(req: Request, res: Response): Promise<void> {
    try {
      const { postId, userId, content, createdAt } = req.query;
      const query: Record<string, any> = {};

      // Build search query
      if (postId) {
        query.postId = { $regex: postId, $options: 'i' };
      }
      if (userId) {
        query.userId = { $regex: userId, $options: 'i' };
      }
      if (content) {
        query.content = { $regex: content, $options: 'i' };
      }
      if (createdAt) {
        const date = new Date(createdAt as string);
        if (isNaN(date.getTime())) {
          res.status(200).json(createErrorResponse('Ngày tạo không hợp lệ'));
          return;
        }
        const startOfDay = new Date(date.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setUTCHours(23, 59, 59, 999));
        query.createdAt = { $gte: startOfDay, $lte: endOfDay };
      }

      const comments = await commentService.searchComments(query);
      res.status(200).json(createSuccessResponse(comments, 'Tìm kiếm bình luận thành công'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi không xác định';
      res.status(200).json(createErrorResponse(message));
    }
  }
}

export const commentController = new CommentController();
