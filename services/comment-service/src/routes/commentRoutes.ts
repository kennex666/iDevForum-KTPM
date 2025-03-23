import express from 'express';
import { createComment, getComments, getCommentById, updateComment, deleteComment } from '../services/commentService';

const commentRoutes = express.Router();

commentRoutes.get('/', async (req, res) => {
    try {
        const comments = await getComments();
        res.status(200).json(comments);
    } catch (err) {
        console.error("Error while getting comments:", err);

        res.status(400).json({
            message: "Lỗi khi lấy dữ liệu bình luận, vui lòng thử lại sau",
            error: err,
        });
    }
});

commentRoutes.post('/save', async (req, res) => {
    try {
        const { postId, userId, content } = req.body;
        if (!postId || !userId || !content || content.trim().length === 0) {
            throw new Error("Vui lòng nhập đủ thông tin bình luận");
        }

        const comment = await createComment({ postId, userId, content });
        res.status(201).json(comment);

    } catch (err) {
        console.error("Error while creating comment:", err);
        
        if(err instanceof Error) {
            res.status(400).json({
                message: err.message
            });
        } else {
            res.status(400).json({
                message: "Lỗi không xác định. Vui lòng thử lại sau."
            });
        }
    }
});

commentRoutes.get('/comment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const comment = await getCommentById(id);
        if (!comment) {
            res.status(404).json({
                message: "Không tìm thấy bình luận"
            });
        } else {
            res.status(200).json(comment);
        }
    } catch (err) {
        console.error("Error while processing request:", err);
        if (err instanceof Error) {
            res.status(400).json({
                message: err.message
            });
        } else {
            res.status(400).json({
                message: "Lỗi không xác định. Vui lòng thử lại sau."
            });
        }
    }
});

commentRoutes.put('/comment/:id', async (req, res) => {
    try {
        const comment = await updateComment(req.params.id, req.body);
        res.status(200).json(comment);
    } catch (err) {
        res.status(400).json(err);
    }
});

commentRoutes.delete('/comment/:id', async (req, res) => {
    try {
        const comment = await deleteComment(req.params.id);
        res.status(200).json(comment);
    } catch (err) {
        res.status(400).json(err);
    }
});

export default commentRoutes;