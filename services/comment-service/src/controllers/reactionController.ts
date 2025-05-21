import {Request, Response} from 'express';
import {reactionService} from '../services/reactionService';
import { IReaction } from '../models/reactionModel';


class ReactionController {
    async getAllReactionsViaPost (req: Request, res: Response) {
        const postId = req.params.id;
        if (!postId) {
            return res.status(200).json({errorMessage: "Post ID is required", errorCode: 400, data: null});
        }
        try {
            const reactions = await reactionService.getReactionViaPostId(postId);
            res.status(200).json({errorMessage: "Retrieved success", errorCode: 200, data: reactions});
        } catch (error) {
            return res.status(200).json({
				errorMessage: "Error service",
				errorCode: 400,
				data: null,
			});
        }
    }

    async getAllReactionsViaUser (req: Request, res: Response) {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({errorMessage: "User ID is required", errorCode: 400, data: null});
        }
        try {
            const reactions = await reactionService.getReactionViaUserId(userId);
            res.status(200).json({errorMessage: "Retrieved success", errorCode: 200, data: reactions});
        } catch (error) {
            return res
				.status(200)
				.json({
					errorMessage: "Error service",
					errorCode: 500,
					data: null,
				});
        }
    }

    async reactionAction (req: Request, res: Response) {
        const {action} = req.params;
        const userId = req.user._id;
        const postId = req.params.postId;
        if (!postId) {
            return res.status(400).json({errorMessage: "Post ID is required", errorCode: 400, data: null});
        }
        try {
            const reaction = await reactionService.addReaction({
                type: action.toUpperCase() as "UPVOTE" | "DOWNVOTE",
                postId: postId,
                userId: userId,
            } as IReaction);
            res.status(200).json({errorMessage: "Action success", errorCode: 200, data: reaction});
        } catch (error) {
            return res.status(200).json({
				errorMessage: "Error service",
				errorCode: 500,
				data: null,
			});
        }
    }
}

const reactionController = new ReactionController();
export {reactionController};