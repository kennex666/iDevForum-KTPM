import { Types } from 'mongoose';
import ReactionModel, { IReaction } from '../models/reactionModel';
import { UserClient } from '../clients/user';
import { PostClient } from '../clients/post';
import { CommentClient } from '../clients/comment';


const getReaction = async (): Promise<any[] | null> => {
    const reactions = await ReactionModel.find();

    const enrichedReactions = await Promise.all(
        reactions.map(async (reaction) => {
            const user = await UserClient.getUserById(reaction.userId.toString()).catch(() => null);
            const post = reaction.targetType === "post"
                ? await PostClient.getPostById(reaction.targetId).catch(() => null)
                : null;
            const comment = reaction.targetType === "comment"
                ? await CommentClient.getCommentById(reaction.targetId).catch(() => null)
                : null;
            return {
                ...reaction.toObject(),
                user: user?.data || null,
                post: post?.data || null,
                comment: comment?.data || null
            };
        })
    );


    return enrichedReactions;
}

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
const getReactionsByTargetId = async (targetId: string): Promise<any[]> => {
    if (!Types.ObjectId.isValid(targetId)) {
        throw new Error("Invalid targetId format");
    }
    const reactions = await ReactionModel.find({ targetId });

    const enrichedReactions = await Promise.all(
        reactions.map(async (reaction) => {
            const user = await UserClient.getUserById(reaction.userId.toString()).catch(() => null);
            const post = reaction.targetType === "post"
                ? await PostClient.getPostById(targetId).catch(() => null)
                : null;
            const comment = reaction.targetType === "comment"
                ? await CommentClient.getCommentById(targetId).catch(() => null)
                : null;
            return {
                ...reaction.toObject(),
                user: user?.data || null,
                post: post?.data || null,
                comment: comment?.data || null
            };
        })
    );

    return enrichedReactions;
}
const updateReaction = async (userId: string, targetId: string, targetType: string, reactionType: string): Promise<IReaction | null> => {
    if (!Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId format");
    }
    if (!Types.ObjectId.isValid(targetId)) {
        throw new Error("Invalid targetId format");
    }
    const reaction = await ReactionModel.findOneAndUpdate({ userId, targetId, targetType }, { reactionType }, { new: true });
    if (!reaction) {
        throw new Error("Reaction not found");
    }
    return reaction;
}

const getReactionById = async (reactionId: string): Promise<any | null> => {
    if (!Types.ObjectId.isValid(reactionId)) {
        throw new Error("Invalid reactionId format");
    }

    const reaction = await ReactionModel.findById(reactionId);
    if (!reaction) {
        throw new Error("Reaction not found");
    }

    const { userId, targetId, targetType } = reaction;

    const [userRes, targetRes] = await Promise.all([
        UserClient.getUserById(userId),
        targetType === "post"
            ? PostClient.getPostById(targetId)
            : CommentClient.getCommentById(targetId)
    ]);

    if (userRes.errorCode !== 200) {
        throw new Error(userRes.errorMessage);
    }
    if (targetRes.errorCode !== 200) {
        throw new Error(targetRes.errorMessage);
    }

    const result: any = {
        ...reaction.toObject(),
        user: userRes.data
    };
    result[targetType] = targetRes.data;

    return result;
};



export {
    getReaction,
    createReaction,
    deleteReaction,
    getReactionsByTargetId,
    updateReaction,
    getReactionById
};