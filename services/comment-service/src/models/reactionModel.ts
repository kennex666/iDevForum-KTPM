import { Schema, model, Document } from 'mongoose';

interface IReaction extends Document {
    reactionId: string;
    type: "UPVOTE" | "DOWNVOTE" | "NONE";
    postId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
const reactionSchema = new Schema({
    reactionId: { type: String },
    type: { type: String, enum: ["UPVOTE", "DOWNVOTE", "NONE"], default: "NONE" },
    postId: { type: String, required: true },
    userId: { type: String, required: true },
},
    { timestamps: true }
);

reactionSchema.pre<IReaction>("save", function (next) {
    if (this.isNew || this.reactionId === undefined) {
        this.reactionId = this._id + "";
    }
    next();
});

const ReactionModel = model<IReaction>("Reaction", reactionSchema);
export { IReaction, ReactionModel };
export default ReactionModel;