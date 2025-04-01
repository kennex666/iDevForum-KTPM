import {CommentModel , IComment } from "../models/commentModel";


const getComments = async (): Promise<IComment[]> => {
    return await CommentModel.find();
}

const createComment = async (commentData: { postId: string, userId: string, content: string }): Promise<IComment> => {
    try {
        const comment = new CommentModel(commentData);
        return await comment.save();
    } catch (err) {
        console.error("Error creating comment:", err);
        if (err instanceof Error) {
            throw new Error("Không thể tạo bình luận. Vui lòng thử lại sau.");
        } else {
            throw new Error("Lỗi không xác định. Vui lòng thử lại sau.");
        }
    }
}

const getCommentById = async (id: string): Promise<IComment | null> => {
    try {
        const comment = await CommentModel.findById(id);
        return comment;
    } catch (err) {
        console.error("Error while fetching comment:", err);
        throw new Error("Không thể tìm thấy bình luận. Vui lòng thử lại sau.");
    }
}
   

const updateComment = async (id: string, content: string): Promise<IComment | null> => {
    try {
        const comment = await CommentModel.findByIdAndUpdate(id, { content }, { new: true });
        console.log(comment);
        return comment;
    } catch (err) {
        console.error("Error while updating comment:", err);
        throw new Error("Không thể cập nhật bình luận. Vui lòng thử lại sau.");
    }
};


const deleteComment = async (id: string): Promise<boolean> => {
    try {
        const result = await CommentModel.findByIdAndDelete(id);
        return result !== null;
    } catch (err) {
        console.error("Error while deleting comment:", err);
        throw new Error("Không thể xóa bình luận. Vui lòng thử lại sau.");
    }
};

const searchComments = async (query: any): Promise<IComment[]> => {
    try {
        const comments = await CommentModel.find(query); // Use the query object directly
        return comments;
    } catch (err) {
        console.error("Error while searching comments:", err);
        throw new Error("Không thể tìm kiếm bình luận. Vui lòng thử lại sau.");
    }
};

export { createComment, getComments, getCommentById, updateComment, deleteComment, searchComments };