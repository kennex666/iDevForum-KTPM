import { Schema, model, Document } from "mongoose";

interface IComment extends Document {
    commentId: string;
    postId: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema({
    commentId: { type: String, required: true },
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true }
},
    { timestamps: true }
);

const CommentModel = model<IComment>("Comment", commentSchema);

export { IComment , CommentModel};

