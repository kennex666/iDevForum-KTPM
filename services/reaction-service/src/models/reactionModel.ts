import { Schema, model, Document } from 'mongoose';

interface IReaction extends Document {
    userId: string;
    targetId: string;
    targetType: string;
    type: string;
}

const reactionSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    targetId: {
        type: String,
        required: true
    },
    targetType: {
        type: String,
        enum: ['post', 'comment'],
        required: true
    },
    reactionType: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
})

const ReactionModel = model<IReaction>('Reaction', reactionSchema);

export default ReactionModel;
export { IReaction };