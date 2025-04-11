import { error } from 'console';
import * as reactionService from '../services/reactionServices';
import e from 'express';

const createReaction = async (req: any, res: any) => {
    const { userId, targetId, targetType, reactionType } = req.body;
    try {
        if (!userId || userId.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "userId is required",
                data: null
            });
        }
        if (!targetId || targetId.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "targetId is required",
                data: null
            });
        }
        if (!targetType || targetType.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "targetType is required",
                data: null
            });
        }
        if (!reactionType || reactionType.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "type is required",
                data: null
            });
        }
        const reaction = await reactionService.createReaction(userId, targetId, targetType, reactionType);
        return res.status(201).json({
            errorCode: 201,
            errorMessage: "Reaction created successfully",
            data: reaction
        });

    } catch (err: any) {
        if (err instanceof Error) {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: err.message,
                data: null
            });
        } else {
            return res.status(500).json({
                errorCode: 500,
                errorMessage: "Internal Server Error",
                data: null
            });
        }

    }
}

const deleteReaction = async (req: any, res: any) => {
    try {
        const { userId, targetId, targetType, reactionType } = req.body;
        if (!userId || userId.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "userId is required",
                data: null
            });
        }
        if (!targetId || targetId.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "targetId is required",
                data: null
            });
        }
        if (!targetType || targetType.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "targetType is required",
                data: null
            });
        }
        if (!reactionType || reactionType.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "type is required",
                data: null
            });
        }
        const reaction = await reactionService.deleteReaction(userId, targetId, targetType, reactionType);
        if (!reaction) {
            return res.status(404).json({
                errorCode: 404,
                errorMessage: "Reaction not found",
                data: null
            });
        }
        return res.status(200).json({
            errorCode: 200,
            errorMessage: "Reaction deleted successfully",
            data: reaction
        });
    } catch (error: any) {
        if (error instanceof Error) {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: error.message,
                data: null
            });
        } else {
            return res.status(500).json({
                errorCode: 500,
                errorMessage: "Internal Server Error",
                data: null
            });
        }
    }
}
const getReactionsByTargetId = async (req: any, res: any) => {
    const targetId = req.params.id;
    const targetType = req.body.targetType;
    try {
        if (!targetId || targetId.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "targetId is required",
                data: null
            });
        }
        if (!targetType || targetType.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "targetType is required",
                data: null
            });
        }
        const reactions = await reactionService.getReactionsByTargetId(targetId, targetType);
        if (!reactions) {
            return res.status(404).json({
                errorCode: 404,
                errorMessage: "Reactions not found",
                data: null
            });
        }
        return res.status(200).json({
            errorCode: 200,
            errorMessage: "Get reactions successfully",
            data: reactions
        });
    } catch (error: any) {
        if (error instanceof Error) {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: error.message,
                data: null
            });
        } else {
            return res.status(500).json({
                errorCode: 500,
                errorMessage: "Internal Server Error",
                data: null
            });
        }
    }
}
const updateReaction = async (req: any, res: any) => {
    const { userId, targetId, targetType, reactionTypeNew } = req.body;
    try {
        if (!userId || userId.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "userId is required",
                data: null
            });
        }
        if (!targetId || targetId.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "targetId is required",
                data: null
            });
        }
        if (!targetType || targetType.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "targetType is required",
                data: null
            });
        }
        if (!reactionTypeNew || reactionTypeNew.trim() === "") {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: "reactionTypeNew is required",
                data: null
            });
        }
        const reaction = await reactionService.updateReaction(userId, targetId, targetType, reactionTypeNew);
        return res.status(200).json({
            errorCode: 200,
            errorMessage: "Reaction updated successfully",
            data: reaction
        });
    } catch (error: any) {
        if (error instanceof Error) {
            return res.status(400).json({
                errorCode: 400,
                errorMessage: error.message,
                data: null
            });
        } else {
            return res.status(500).json({
                errorCode: 500,
                errorMessage: "Internal Server Error",
                data: null
            });
        }
    }
}
export {
    createReaction,
    deleteReaction,
    getReactionsByTargetId,
    updateReaction
};