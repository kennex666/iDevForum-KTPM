import { ReactionModel, IReaction } from "../models/reactionModel";

class ReactionService {
    async downvoteComment(postId: string, userId: string): Promise<IReaction | null> {
        const existing = await ReactionModel.findOne({ postId, userId });
        if (!existing) {
            // Chưa có hành động, tạo mới với type là DOWNVOTE
            return await ReactionModel.findOneAndUpdate(
                { postId, userId },
                { type: "DOWNVOTE" },
                { new: true, upsert: true }
            );
        } else if (existing.type === "DOWNVOTE") {
            // Nếu đã downvote, nhấn lần nữa thì thành NONE
            return await ReactionModel.findOneAndUpdate(
                { postId, userId },
                { type: "NONE" },
                { new: true }
            );
        } else if (existing.type === "NONE") {
            // Nếu đang là NONE, nhấn thì thành DOWNVOTE
            return await ReactionModel.findOneAndUpdate(
                { postId, userId },
                { type: "DOWNVOTE" },
                { new: true }
            );
        } else {
            // Nếu là trạng thái khác (ví dụ UPVOTE), chuyển sang DOWNVOTE
            return await ReactionModel.findOneAndUpdate(
                { postId, userId },
                { type: "DOWNVOTE" },
                { new: true }
            );
        }
    }

    async upvoteComment(commentId: string, userId: string): Promise<IReaction | null> {
        const existing = await ReactionModel.findOne({ commentId, userId });
        if (!existing) {
            // Chưa có hành động, tạo mới với type là UPVOTE
            return await ReactionModel.findOneAndUpdate(
            { commentId, userId },
            { type: "UPVOTE" },
            { new: true, upsert: true }
            );
        } else if (existing.type === "UPVOTE") {
            // Nếu đã upvote, nhấn lần nữa thì thành NONE
            return await ReactionModel.findOneAndUpdate(
            { commentId, userId },
            { type: "NONE" },
            { new: true }
            );
        } else if (existing.type === "NONE") {
            // Nếu đang là NONE, nhấn thì thành UPVOTE
            return await ReactionModel.findOneAndUpdate(
            { commentId, userId },
            { type: "UPVOTE" },
            { new: true }
            );
        } else {
            // Nếu là trạng thái khác (ví dụ DOWNVOTE), chuyển sang UPVOTE
            return await ReactionModel.findOneAndUpdate(
            { commentId, userId },
            { type: "UPVOTE" },
            { new: true }
            );
        }
    }

    async getReactionByCommentId(commentId: string): Promise<IReaction | null> {
        const reaction = await ReactionModel.findOne({
            commentId,
        });
        return reaction;
    }
}
const reactionService = new ReactionService();
export { reactionService };
export default reactionService;