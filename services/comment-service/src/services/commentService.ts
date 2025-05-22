import { CommentModel, IComment } from "../models/commentModel";
import { ICommentService, CreateCommentDTO } from '../interfaces/commentService.interface';
import { postClient, userClient } from "../clients/user.client";
import {generateResponse} from "../utils/modelAI";
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
  async getAllComments(): Promise<any[]> {
    try {
      const items = await CommentModel.find();
  
      // Use Promise.all to resolve all async operations in parallel
      const comments = await Promise.all(
        items.map(async (item: any) => {
          console.log("322121", item.userId, item.postId);
          try {
            const user = await userClient.getUserById(item.userId.toString()).catch(() => null);
            const post = await postClient.getPostById(item.postId.toString()).catch(() => null);
          
            return {
              ...item.toObject(),
              user: user?.data || null,
              post: post?.data || 1,
            };
          } catch (error) {
            console.error(`Error fetching related data for comment ID ${item._id}:`, error);
            return null; // Handle errors gracefully for individual items
          }
        })
      );
  
      // Filter out any null results due to errors
      return comments.filter((comment: any) => comment !== null);
    } catch (error) {
      console.error('Error getting all comments:', error);
      throw new Error('Failed to fetch comments');
    }
  }

  /**
   * Get all comments bad
   */
  async getAllCommentsBad(): Promise<any[]> {
    try {
      // Lấy các comment chưa được kiểm tra hoặc chưa có trường isCheck
      const uncheckedComments = await CommentModel.find({ $or: [{ isCheck: false }, { isCheck: { $exists: false } }] });
      if (uncheckedComments.length === 0) return [];

      // Tạo prompt cho AI
      const prompt = uncheckedComments.map((item: any) => `ID: ${item._id}, Nội dung: ${item.content}`).join('\n');
      const response = await generateResponse(prompt);

      // Lấy danh sách ID comment bị đánh dấu là bad từ AI
      const ids = (response || "")
        .split('\n')
        .map((id: string) => id.trim())
        .filter((id: string) => id.length > 0);

      // Đánh dấu các comment là bad
      for (const id of ids) {
        const updated = await CommentModel.findOneAndUpdate(
          { commentId: id },  
          { isCheck: true, isBad: true },
          { new: true, runValidators: true }
        );
      }
      const badComments = await CommentModel.find({ isBad: true });
      // Lấy thông tin user và post cho từng comment
      const comments = await Promise.all(
        badComments.map(async (item: any) => {
          try {
            const user = await userClient.getUserById(item.userId.toString()).catch(() => null);
            const post = await postClient.getPostById(item.postId.toString()).catch(() => null);
            return {
              ...item.toObject(),
              user: user?.data || null,
              post: post?.data || null,
            };
          } catch (error) {
            console.error(`Error fetching related data for comment ID ${item._id}:`, error);
            return null;
          }
        })
      );

      // Trả về danh sách comment bad đã có thông tin user và post
      return comments.filter((comment: any) => comment !== null);
    } catch (error) {
      console.error('Error getting all bad comments:', error);
      throw new Error('Failed to fetch bad comments');
    }
  }

  /**
   * Create a new comment
   */
  async createComment(data: CreateCommentDTO): Promise<any> {
    try {
      const comment = new CommentModel(data);
      const item = await comment.save();
      const user = await userClient.getUserById(data.userId);
      return {
        id: item._id,
        content: item.content,
        postId: item.postId,
        user: user,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  /**
   * Get a comment by ID
   */
  async getCommentById(id: string): Promise<any> {
    try {
      const item = await CommentModel.findById(id);
      if (!item) {
        throw new Error(`Comment with ID ${id} not found`);
      }

      try {
        const post = await postClient.getPostById(item.postId);
        const user = await userClient.getUserById(item.userId);

        return {
          id: item._id,
          content: item.content,
          postId: post,
          user: user,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      } catch (error) {
        console.error(`Error fetching related data for comment ID ${id}:`, error);
        throw new Error('Failed to fetch related data for the comment');
      }
    } catch (error) {
      console.error('Error getting comment by ID:', error);
      throw error;
    }
  }

  /**
   * Get comments by post ID
   */
  async getCommentsByPostId(postId: string): Promise<any[]> {
    try {
      const items = await CommentModel.find({ postId });

      // Use Promise.all to resolve all async operations in parallel
      const comments = await Promise.all(
        items.map(async (item: any) => {
          try {
            const user = await userClient.getUserById(item.userId);
            return {
              id: item._id,
              content: item.content,
              postId: item.postId,
              user: user,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            };
          } catch (error) {
            console.error(`Error fetching related data for comment ID ${item._id}:`, error);
            return null; // Handle errors gracefully for individual items
          }
        })
      );

      // Filter out any null results due to errors
      return comments.filter((comment: any) => comment !== null);
    } catch (error) {
      console.error('Error getting comments by post ID:', error);
      throw new Error('Failed to fetch comments by post ID');
    }
  }

  /**
   * Get comments by user ID
   */
  async getCommentsByUserId(userId: string): Promise<any[]> {
    try {
      const items = await CommentModel.find({ userId });

      // Use Promise.all to resolve all async operations in parallel
      const comments = await Promise.all(
        items.map(async (item: any) => {
          try {
            const post = await postClient.getPostById(item.postId);
            return {
              id: item._id,
              content: item.content,
              postId: post,
              userId: item.userId,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            };
          } catch (error) {
            console.error(`Error fetching related data for comment ID ${item._id}:`, error);
            return null; // Handle errors gracefully for individual items
          }
        })
      );

      // Filter out any null results due to errors
      return comments.filter((comment: any) => comment !== null);
    } catch (error) {
      console.error('Error getting comments by user ID:', error);
      throw new Error('Failed to fetch comments by user ID');
    }
  }

  /**
   * Update a comment
   */
  async updateComment(id: string, userId: string, content: string): Promise<IComment | null> {
    try {
        // Tìm bình luận theo ID
        const comment = await CommentModel.findById(id);

        if (!comment) {
            throw new Error(`Comment with ID ${id} not found`);
        }

        // Kiểm tra xem userId có khớp với userId của bình luận không
        if (comment.userId.toString() !== userId) {
            throw new Error("You are not authorized to update this comment");
        }

        // Cập nhật nội dung bình luận
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
  async deleteComment(id: string, userId: string): Promise<boolean> {
    try {
      const user = await userClient.getUserById(userId);
      console.log("user312", user.data);
      if (!user) throw new Error(`User with ID ${userId} not found`);
      if (user?.data.role == "1") {
        const result = await CommentModel.findByIdAndDelete(id);
        return result !== null;
      }
      const comment = await CommentModel.findById(id);
      if (!comment) throw new Error(`Comment with ID ${id} not found`);
      if (comment.userId.toString() !== userId) throw new Error("You are not authorized to delete this comment");

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
  async searchComments(query: Record<string, any>): Promise<any[]> {
    try {
      const items = await CommentModel.find(query);

      // Use Promise.all to resolve all async operations in parallel
      const comments = await Promise.all(
        items.map(async (item: any) => {
          try {
            const post = await postClient.getPostById(item.postId);
            const user = await userClient.getUserById(item.userId);

            return {
              id: item._id,
              content: item.content,
              postId: post,
              user: user,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            };
          } catch (error) {
            console.error(`Error fetching related data for comment ID ${item._id}:`, error);
            return null; // Handle errors gracefully for individual items
          }
        })
      );

      // Filter out any null results due to errors
      return comments.filter((comment: any) => comment !== null);
    } catch (error) {
      console.error('Error searching comments:', error);
      throw new Error('Failed to search comments');
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