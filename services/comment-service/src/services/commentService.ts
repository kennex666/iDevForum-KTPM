import {CommentModel , IComment } from "../models/commentModel";

const createComment = async (comment: IComment): Promise<IComment> => {
    const newComment = new CommentModel(comment);
    return await newComment.save();
}

const getComments = async (): Promise<IComment[]> => {
    return await CommentModel.find();
}

const getCommentById = async (id: string): Promise<IComment | null> => {
    return await CommentModel.findById(id);
}   

const updateComment = async (id: string, comment: IComment): Promise<IComment | null> => {
    return await CommentModel.findByIdAndUpdate (id, comment, {new: true});
}

const deleteComment = async (id: string): Promise<IComment | null> => {
    return await CommentModel.findByIdAndDelete(id);
}