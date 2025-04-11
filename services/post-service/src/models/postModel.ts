import { Schema, model, Document } from "mongoose";
import { PostStatus } from "./postStatus";
import { url } from "inspector";
 interface IPost extends Document {
    postId: string;
    title: string;
    description: string;
    content: string;
    url: string;
    status: PostStatus;
    totalComments: number;
    totalUpvote: number;
    totalDownvote: number;
    totalShare: number;
    totalView: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    tagId: string;
 }
 const postSchema = new Schema({
    postId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: String, enum: Object.values(PostStatus), required: true },
    totalComments: { type: Number, required: true },
    totalUpvote: { type: Number, required: true },
    totalDownvote: { type: Number, required: true },
    totalShare: { type: Number, required: true },
    totalView: { type: Number, required: true },
    userId: { type: String, required: true },
    tagId: { type: String, required: true },
 },
 {
    timestamps: true,
 }
);
const PostModel = model<IPost>("Post", postSchema);

export { PostModel, IPost };