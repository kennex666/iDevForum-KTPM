import { Schema, model, Document } from 'mongoose';

interface IReaction extends Document {
    type: "UPVOTE" | "DOWNVOTE";
    postId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
const reactionSchema = new Schema({
    type: { type: String, enum: ["UPVOTE", "DOWNVOTE", "NONE"], default: "NONE" },
    postId: { type: String, required: true },
    userId: { type: String, required: true },
},
    { timestamps: true }
);

const ReactionModel = model<IReaction>("Reaction", reactionSchema);
export { IReaction, ReactionModel };
export default ReactionModel;