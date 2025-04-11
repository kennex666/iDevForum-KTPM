import { CommentModel, IComment } from "../models/commentModel";
import { ICommentService, CreateCommentDTO } from '../interfaces/commentService.interface';

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
      console.error('Error getting all comments:', error);
      throw error;
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
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  /**
   * Get a comment by ID
   */
  async getCommentById(id: string): Promise<IComment | null> {
    try {
      return await CommentModel.findById(id);
    } catch (error) {
      console.error('Error getting comment by ID:', error);
      throw error;
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
      console.error('Error updating comment:', error);
      throw error;
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
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  /**
   * Search comments by query
   */
  async searchComments(query: Record<string, any>): Promise<IComment[]> {
    try {
      return await CommentModel.find(query);
    } catch (error) {
      console.error('Error searching comments:', error);
      throw error;
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