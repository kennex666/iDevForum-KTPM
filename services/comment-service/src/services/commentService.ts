import { CommentModel, IComment } from "../models/commentModel";

/**
 * Comment service interface
 */
interface ICommentService {
  getAllComments(): Promise<IComment[]>;
  createComment(data: CreateCommentDTO): Promise<IComment>;
  getCommentById(id: string): Promise<IComment | null>;
  updateComment(id: string, content: string): Promise<IComment | null>;
  deleteComment(id: string): Promise<boolean>;
  searchComments(query: Record<string, any>): Promise<IComment[]>;
}

/**
 * DTO for creating a new comment
 */
interface CreateCommentDTO {
  postId: string;
  userId: string;
  content: string;
}

/**
 * Custom error class for comment service
 */
class CommentServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommentServiceError';
  }
}

/**
 * Comment service implementation
 */
class CommentService implements ICommentService {
  /**
   * Get all comments
   */
  async getAllComments(): Promise<IComment[]> {
    try {
      return await CommentModel.find();
    } catch (error) {
      this.handleError(error, 'Lỗi khi lấy danh sách bình luận');
    }
  }

  /**
   * Create a new comment
   */
  async createComment(data: CreateCommentDTO): Promise<IComment> {
    try {
      const comment = new CommentModel(data);
      return await comment.save();
    } catch (error) {
      this.handleError(error, 'Không thể tạo bình luận');
    }
  }

  /**
   * Get a comment by ID
   */
  async getCommentById(id: string): Promise<IComment | null> {
    try {
      return await CommentModel.findById(id);
    } catch (error) {
      this.handleError(error, 'Không thể tìm thấy bình luận');
    }
  }

  /**
   * Update a comment
   */
  async updateComment(id: string, content: string): Promise<IComment | null> {
    try {
      return await CommentModel.findByIdAndUpdate(
        id,
        { content },
        { new: true }
      );
    } catch (error) {
      this.handleError(error, 'Không thể cập nhật bình luận');
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(id: string): Promise<boolean> {
    try {
      const result = await CommentModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      this.handleError(error, 'Không thể xóa bình luận');
    }
  }

  /**
   * Search comments by query
   */
  async searchComments(query: Record<string, any>): Promise<IComment[]> {
    try {
      return await CommentModel.find(query);
    } catch (error) {
      this.handleError(error, 'Không thể tìm kiếm bình luận');
    }
  }

  /**
   * Handle errors in a consistent way
   */
  private handleError(error: unknown, defaultMessage: string): never {
    console.error('Comment service error:', error);
    throw new CommentServiceError(
      error instanceof Error ? error.message : defaultMessage
    );
  }
}

// Export a singleton instance
export const commentService = new CommentService();