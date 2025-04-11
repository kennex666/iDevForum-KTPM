/**
 * Validate comment input data
 */
export const validateCommentInput = (data: { postId?: string; userId?: string; content?: string }): string | null => {
  const { postId, userId, content } = data;

  if (!postId || !userId || !content) {
    return 'Vui lòng nhập đầy đủ thông tin bình luận';
  }

  if (content.trim().length === 0) {
    return 'Nội dung bình luận không được để trống';
  }

  return null;
};

/**
 * Validate ID format
 */
export const validateId = (id: string): boolean => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(id);
}; 