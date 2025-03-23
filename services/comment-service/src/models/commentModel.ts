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
    commentId: {type: String},
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { 
        type: String,
        required: [true, "Comment không được để trống"],
        minlength: [1, "Comment phải có ít nhất 1 ký tự"],
        maxlength: [500, "Comment không được vượt quá 500 ký tự"],
        trim: true
    }
},
    { timestamps: true }
);

commentSchema.pre<IComment>("save", function (next) {
    if (this.isNew || this.commentId === undefined) {
        this.commentId = this._id+"";
    }
    next();
});


const CommentModel = model<IComment>("Comment", commentSchema);

export { IComment , CommentModel};