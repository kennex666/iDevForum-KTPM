import express from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost, searchPost } from '../services/postService';
import e from 'express';

const postRoute = express.Router();

postRoute.get('/', async (req, res) => {
    try {
        const post = await getPosts();
        res.status(200).json({
            errorCode: 0,
            errorMessage: "Lấy danh sách bài viết thành công",
            data: post,
        });
    } catch (err) {
        console.error("Error while getting comments:", err);
        if (err instanceof Error) {
            res.status(400).json({
                errorCode: 400,
                errorMessage: err.message,
                data: null,
            });
        } else {
            res.status(400).json({
                errorCode: 400,
                errorMessage: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }
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
            res.status(400).json({
                errorCode: 400,
                message: "Vui lòng nhập đầy đủ thông tin bài viết",
                data: null,
            });
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

        res.status(201).json({
            errorCode: 200,
            errorMessage: "Tạo bài viết thành công",
            data: post,
        });

    } catch (err) {
        console.error("Error while creating post:", err);

        if (err instanceof Error) {
            res.status(400).json({
                errorCode: 400,
                errorMessage: err.message,
                data: null,
            });
        } else {
            res.status(400).json({
                errorCode: 400,
                errorMessage: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
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
                errorCode: 404,
                message: "Không tìm thấy bài đăng",
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 200,
                errorMessage: "Lấy bài đăng thành công",
                data: post,
            });
        }
    } catch (err) {
        console.error("Error while processing request:", err);
        if (err instanceof Error) {
            res.status(400).json({
                errorCode: 400,
                message: err.message,
                data: null,
            });
        } else {
            res.status(400).json({
                errorCode: 400,
                message: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
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
            errorCode: 400,
            message: "Vui lòng nhập nội dung chỉnh sửa",
            data: null,
        });
        return;
    }

    try {
        const post = await updatePost(id,title,description,content,url);
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Cập nhật bài viết thành công",
            data: post,
        }
        );
    } catch (err) {
        console.error("Error while updating post:", err);
        if (err instanceof Error) {
            res.status(400).json({
                errorCode: 400,
                message: err.message,
                data: null,
            });
        } else {
            res.status(400).json({
                errorCode: 400,
                message: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }
    }
});

// Xoá bài viết
postRoute.delete('/post/:id', async (req, res) => {
    try {
        const deletedPost = await deletePost(req.params.id);
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Xóa bài viết thành công",
            data: deletedPost,
        });
    } catch (err) {
        console.error("Error while deleting post:", err);
        res.status(400).json({
            errorCode: 400,
            message: err instanceof Error ? err.message : "Lỗi không xác định. Vui lòng thử lại sau.",
            data: null,
        });
    }
});

// Tim kiem theo nhieu dieu kien theo người dung, bai viet, noi dung, thoi gian
postRoute.post('/search', async (req, res) => {
    try {
        const { postId, userId, content, createdAt } = req.body;
        const query: any = {};

        console.log("Search parameters:", req.body);

        if (postId) {
            query.postId = { $regex: postId, $options: 'i' }; // Tìm kiếm postId chứa giá trị
        }
        if (userId) {
            query.userId = { $regex: userId, $options: 'i' }; // Tìm kiếm userId chứa giá trị
        }
        if (content) {
            query.content = { $regex: content, $options: 'i' }; // Tìm kiếm nội dung chứa giá trị
        }
        if (createdAt) {
            const parsedDate = new Date(createdAt as string);
            if (isNaN(parsedDate.getTime())) {
                res.status(400).json({
                    errorCode: 400,
                    errorMessage: "Ngày tạo không hợp lệ. Vui lòng nhập đúng định dạng ngày (YYYY-MM-DD hoặc ISO 8601).",
                    data: null,
                });
                return;
            }
        
            // Tạo khoảng thời gian từ đầu ngày đến cuối ngày
            const startOfDay = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
            const endOfDay = new Date(parsedDate.setUTCHours(23, 59, 59, 999));
        
            query.createdAt = { $gte: startOfDay, $lte: endOfDay }; // Tìm kiếm trong khoảng thời gian của ngày
        }

        const comments = await searchPost(query);
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Lấy bài đắng thành công",
            data: comments,
        });
    } catch (err) {
        console.error("Error while searching comments:", err);
        if (err instanceof Error) {
            res.status(400).json({
                errorCode: 400,
                errorMessage: err.message,
                data: null,
            });
        } else {
            res.status(400).json({
                errorCode: 400,
                errorMessage: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }
    }
});

export default postRoute;