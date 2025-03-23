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
   

const updateComment = async (id: string, comment: IComment): Promise<IComment | null> => {
    return await CommentModel.findByIdAndUpdate (id, comment, {new: true});
}

const deleteComment = async (id: string): Promise<IComment | null> => {
    return await CommentModel.findByIdAndDelete(id);
}

export { createComment, getComments, getCommentById, updateComment, deleteComment };