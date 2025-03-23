import express from 'express';
import { createComment, getComments, getCommentById, updateComment, deleteComment } from '../services/commentService';

const commentRoutes = express.Router();

commentRoutes.get('/', async (req, res) => {
    try {
        const comments = await getComments();
        res.status(200).json(comments);
    } catch (err) {
        res.status(400).json(err);
    }
});

commentRoutes.post('/comment', async (req, res) => {
    try {
        const comment = await createComment(req.body);
        res.status(201).json(comment);
    } catch (err) {
        res.status(400).json(err);
    }
});

commentRoutes.get('/comment/:id', async (req, res) => {
    try {
        const comment = await getCommentById(req.params.id);
        res.status(200).json(comment);
    } catch (err) {
        res.status(400).json(err);
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