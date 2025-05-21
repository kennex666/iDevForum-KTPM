import { ReactionModel, IReaction } from "../models/reactionModel";

class ReactionService {
	async addReaction(reaction: IReaction): Promise<IReaction | null> {
		const newReaction = new ReactionModel(reaction);
		// find if exist
		const existingReaction = await ReactionModel.findOne({
			postId: reaction.postId,
			userId: reaction.userId,
		}).exec();
		if (existingReaction) {
            if (existingReaction.type == reaction.type) {
                return await this.deleteReaction(reaction.postId, reaction.userId);
            }
			await ReactionModel.updateOne(
				{ postId: reaction.postId, userId: reaction.userId },
				{ type: reaction.type }
			).exec();
			return await ReactionModel.findOne({
					postId: reaction.postId,
					userId: reaction.userId,
				}).exec();;
		}
		return await newReaction.save();
	}

	async deleteReaction(postId: string, userId: string) {
		const reaction = await ReactionModel.findOneAndDelete({
			postId: postId,
			userId: userId,
		}).exec();
        if (reaction.deletedCount === 0) {
            return null
        }
		return null;
	}

	async getReactionViaPostIdAndUserId(
		postId: string,
		userId: string
	): Promise<IReaction | null> {
		const reaction = await ReactionModel.findOne({
			postId: postId,
			userId: userId,
		}).exec();
		return reaction;
	}

	async getReactionViaUserId(
		userId: string
	): Promise<IReaction | null> {
		const reaction = await ReactionModel.findOne({
			userId: userId,
		}).exec();
		return reaction;
	}

	async getReactionViaPostId(postId: string): Promise<IReaction[]> {
		const reactions = await ReactionModel.find({ postId: postId }).exec();
		return reactions;
	}
}
const reactionService = new ReactionService();
export { reactionService };
export default reactionService;