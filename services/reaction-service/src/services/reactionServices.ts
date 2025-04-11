import { Types } from 'mongoose';
import ReactionModel, { IReaction } from '../models/reactionModel';

const createReaction = async (userId: string, targetId: string, targetType: string, reactionType: string): Promise<IReaction> => {

    if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId format");
    }
    if (!Types.ObjectId.isValid(targetId)) {
        throw new Error("Invalid targetId format");
    }
    const reaction = await ReactionModel.create({ userId, targetId, targetType, reactionType });
    return reaction;

}

const deleteReaction = async (userId: string, targetId: string, targetType: string, reactionType: string): Promise<IReaction | null> => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId format");
    }
    if (!Types.ObjectId.isValid(targetId)) {
        throw new Error("Invalid targetId format");
    }
    const reaction = await ReactionModel.findOneAndDelete({ userId, targetId, targetType, reactionType });
    return reaction;
}
const getReactionsByTargetId = async (targetId: string, targetType: string): Promise<IReaction[]> => {
    if (!Types.ObjectId.isValid(targetId)) {
        throw new Error("Invalid targetId format");
    }
    const reactions = await ReactionModel.find({ targetId, targetType });
    return reactions;
}
const updateReaction = async (userId: string, targetId: string, targetType: string, reactionType: string): Promise<IReaction | null> => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId format");
    }
    if (!Types.ObjectId.isValid(targetId)) {
        throw new Error("Invalid targetId format");
    }
    const reaction = await ReactionModel.findOneAndUpdate({ userId, targetId, targetType}, { reactionType }, { new: true });
    if (!reaction) {
        throw new Error("Reaction not found");
    }
    return reaction;
}
export {
    createReaction,
    deleteReaction,
    getReactionsByTargetId,
    updateReaction
};