import express from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../services/postService';

const postRoute = express.Router();

postRoute.get('/post', async (req, res) => {
    try {
        const post = await createPost(req.body);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json(error);
    }
}
);

postRoute.get('/post', async (req, res) => {
    try {
        const post = await getPosts();
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json(error);
    }
}
);

postRoute.get('/post/:id', async (req, res) => {
    try {
        const post = await getPostById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json(error);
    }
}
);

postRoute.put('/post/:id', async (req, res) => {
    try {
        const post = await updatePost(req.params.id, req.body);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json(error);
    }
}
);

postRoute.delete('/post/:id', async (req, res) => {
    try {
        const post = await deletePost(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json(error);
    }
}
);

export default postRoute;