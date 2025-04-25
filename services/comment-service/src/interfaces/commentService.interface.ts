import { IComment } from '../models/commentModel';

/**
 * Interface for comment service
 */
export interface ICommentService {
  /**
   * Get all comments
   */
  getAllComments(): Promise<IComment[]>;

  /**
   * Create a new comment
   */
  createComment(data: CreateCommentDTO): Promise<IComment>;

  /**
   * Get a comment by ID
   */
  getCommentById(id: string): Promise<IComment | null>;

  /**
   * Update a comment
   */
  updateComment(id: string, userId: string, content: string): Promise<IComment | null>;

  /**
   * Delete a comment
   */
  deleteComment(id: string, userId: string): Promise<boolean>;

  /**
   * Search comments by query
   */
  searchComments(query: Record<string, any>): Promise<IComment[]>;
}

/**
 * DTO for creating a new comment
 */
export interface CreateCommentDTO {
  postId: string;
  userId: string;
  content: string;
} 