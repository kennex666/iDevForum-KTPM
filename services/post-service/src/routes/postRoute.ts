import express from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../services/postService';

const postRoute = express.Router();

postRoute.get('/', async (req, res) => {
    try {
        const post = await getPosts();
        res.status(200).json(post);
    } catch (err) {
        console.error("Error while getting comments:", err);

        res.status(400).json({
            message: "Lỗi khi lấy dữ liệu bai dang, vui lòng thử lại sau",
            error: err,
        });
    }
}
);

postRoute.post('/save', async (req, res) => {
    try {
        const {
            postId,
            title,
            description,
            content,
            url,
            status,
            totalComments,
            totalUpvote,
            totalDownvote,
            totalShare,
            totalView,
            userId,
            tagId
        } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!postId || !title || !content || !userId || !tagId) {
            throw new Error("Vui lòng nhập đầy đủ thông tin bài viết");
        }

        const post = await createPost({
            postId,
            title,
            description,
            content,
            url,
            status,
            totalComments,
            totalUpvote,
            totalDownvote,
            totalShare,
            totalView,
            userId,
            tagId
        });

        res.status(201).json(post);

    } catch (err) {
        console.error("Error while creating post:", err);

        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(400).json({ message: "Lỗi không xác định. Vui lòng thử lại sau." });
        }
    }
});




// Lấy bài viết theo ID
postRoute.get('/post/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const post = await getPostById(id);
        if (!post) {
            res.status(404).json({
                message: "Không tìm thấy bai dang"
            });
        } else {
            res.status(200).json(post);
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

// Cập nhật bài viết
postRoute.put('/post/:id', async (req, res) => {
    const {
        title,
        description,
        content,
        url,
    } = req.body;
    const { id } = req.params;
    if (!content || content.trim().length === 0) {
        res.status(400).json({
            message: "Vui lòng nhập nội dung chinh sua"
        });
        return;
    }

    try {
        const post = await updatePost(id,title,description,content,url);
        res.status(200).json(post);
    } catch (err) {
        console.error("Error while updating post:", err);
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

// Xoá bài viết
postRoute.delete('/post/:id', async (req, res) => {
    try {
        const deletedPost = await deletePost(req.params.id);
        res.status(200).json(deletedPost);
    } catch (err) {
        console.error("Error while deleting post:", err);
        res.status(400).json({
            message: err instanceof Error ? err.message : "Lỗi không xác định. Vui lòng thử lại sau."
        });
    }
});

export default postRoute;