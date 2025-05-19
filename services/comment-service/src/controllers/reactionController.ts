import {Request, Response} from 'express';
import {reactionService} from '../services/reactionService';

interface ApiResponse<T> {
    errorCode: number;
    errorMessage: string;
    data: T | null;
}

const createSuccessResponse = <T>(data: T, message: string, code: number = 200): ApiResponse<T> => ({
    errorCode: code,
    errorMessage: message,
    data
});

const createErrorResponse = (message: string, code: number = 400): ApiResponse<null> => ({
    errorCode: code,
    errorMessage: message,
    data: null
});

class ReactionController {
     async downvoteComment(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user._id;
            const {postId} = req.body;
            const reaction = await reactionService.downvoteComment(postId, userId);
            res.status(200).json(createSuccessResponse(reaction, 'Downvote comment successfully'));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(200).json(createErrorResponse(message));
        }
    }

    async upvoteComment(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user;
            const {commentId} = req.body;
            const reaction = await reactionService.upvoteComment(commentId, user._id);
            res.status(200).json(createSuccessResponse(reaction, 'Upvote comment successfully'));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(200).json(createErrorResponse(message));
        }
    }
    async getReactionByCommentId(req: Request, res: Response): Promise<void> {
        try {
            const {postId} = req.params;
            const temp = await reactionService.getReactionByCommentId(postId);
            // Ensure temp is an array and not null
            const reactions: Array<{ type: string }> = Array.isArray(temp) ? temp : [];
            const numberOfUpvote = reactions.filter((item: { type: string }) => item.type === 'UPVOTE').length;
            const numberOfDownvote = reactions.filter((item: { type: string }) => item.type === 'DOWNVOTE').length;
            const reaction = {
                numberOfUpvote,
                numberOfDownvote
            };
            res.status(200).json(createSuccessResponse(reaction, 'Get upvote comment successfully'));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            res.status(200).json(createErrorResponse(message));
        }
    }
}

const reactionController = new ReactionController();
export {reactionController};