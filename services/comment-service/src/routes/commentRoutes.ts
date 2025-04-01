import express from 'express';
import { createComment, getComments, getCommentById, updateComment, deleteComment, searchComments} from '../services/commentService';
import { error } from 'console';

const commentRoutes = express.Router();

commentRoutes.get('/', async (req, res) => {
    try {
        const comments = await getComments();
        res.status(200).json({
            errorCode: 0,
            errorMessage: "Lấy danh sách bình luận thành công",
            data: comments,
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
});

commentRoutes.post('/save', async (req, res) => {
    try {
        const allowedFiled = ['postId', 'userId', 'content'];
        const requestedFields = Object.keys(req.body);

        console.log(requestedFields);
        const isValid = requestedFields.filter((field) => {
            return !allowedFiled.includes(field);
        }
        ).length > 0;
        
        console.log(isValid);
        if (!isValid) {
            res.status(400).json({
                errorCode: 400,
                errorMessage: "Vui lòng nhập đúng định dạng",
                data: null,
            });
            return;
        }

        const  { postId, userId, content } = req.body;
        
        if (!postId || !userId || !content || content.trim().length === 0) {
            res.status(400).json({
                errorCode: 400,
                errorMessage: "Vui lòng nhập đầy đủ thông tin bình luận",
                data: null,
            });
        }

        const comment = await createComment({ postId, userId, content });
        res.status(201).json(
            {
                errorCode: 201,
                errorMessage: "Tạo bình luận thành công",
                data: comment,
            }
        );

    } catch (err) {
        console.error("Error while creating comment:", err);

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

commentRoutes.get('/comment/:id', async (req, res) => {
    try {
       // chi gom chu so va chu cai
        const regex = /^[a-zA-Z0-9]+$/;
        if (!regex.test(req.params.id)) {
            res.status(400).json({
                errorCode: 400,
                errorMessage: "ID không hợp lệ",
                data: null,
            });
            return;
        }

        const { id } = req.params;

        console.log(id);
        const comment = await getCommentById(id);
        if (!comment) {
            res.status(404).json({
                errorCode: 404,
                errorMessage: "Không tìm thấy bình luận",
                data: null,
            });
        } else {
            res.status(200).json(
                {
                    errorCode: 200,
                    errorMessage: "Lấy bình luận thành công",
                    data: comment,
                }
            );
        }
    } catch (err) {
        console.error("Error while processing request:", err);
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

commentRoutes.put('/comment/:id', async (req, res) => {
    // chi gom chu so va chu cai
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(req.params.id)) {
        res.status(400).json({
            errorCode: 400,
            errorMessage: "ID không hợp lệ",
            data: null,
        });
        return;
    }

    // kiem tra content
    // chi gom chu so va chu cai
    const allowedFiled = ['content'];
    const requestedFields = Object.keys(req.body);
    const isValid = requestedFields.filter((field) => {
        return !allowedFiled.includes(field);
    }
    ).length > 0;
    if (isValid || req.body.content === undefined) {
        res.status(400).json({
            errorCode: 400,
            errorMessage: "Vui lòng nhập đúng định dạng",
            data: null,
        });
        return;
    }
    
    const { content } = req.body;
    const { id } = req.params;
    
    if (!content || content.trim().length === 0) {
        res.status(400).json({
            errorCode: 400,
            errorMessage: "Vui lòng nhập nội dung bình luận",
            data: null,
        });
        return;
    }

    try {
        const comment = await updateComment(id, content);
        res.status(200).json(
            {
                errorCode: 200,
                errorMessage: "Cập nhật bình luận thành công",
                data: comment,
            }
        );
    } catch (err) {
        console.error("Error while updating comment:", err);
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

commentRoutes.delete('/comment/:id', async (req, res) => {
    try {
        // chi gom chu so va chu cai va dung giong id trong db
        const regex = /^[a-zA-Z0-9]+$/;
        if (!regex.test(req.params.id)) {
            res.status(400).json({
                errorCode: 400,
                errorMessage: "ID không hợp lệ",
                data: null,
            });
            return;
        }
        const { id } = req.params;
        const comment = await deleteComment(id);
        if (!comment) {
            res.status(404).json({
                errorCode: 404,
                errorMessage: "Không tìm thấy bình luận",
                data: null,
            });
        } else {
            res.status(200).json(comment);
        }
    } catch (err) {
        console.error("Error while deleting comment:", err);
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

// Tim kiem theo nhieu dieu kien theo người dung, bai viet, noi dung, thoi gian
commentRoutes.post('/search', async (req, res) => {
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

        const comments = await searchComments(query);
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Lấy bình luận thành công",
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

export default commentRoutes;