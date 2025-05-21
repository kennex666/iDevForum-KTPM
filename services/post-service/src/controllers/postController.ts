import { get } from 'http';
import { createPost, getPosts, getPostById, updatePost,actionBookmark, deletePost, searchPost, updatePostByAdmin, listBookmarks } from '../services/postService';
import { Request, Response } from 'express';
import { toSlugWithTimestamp } from '../utils/string';
import { PostStatus } from '../models/postStatus';

const getPostByAuthor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        req.query.offset = req.query.offset || 0;
        const result = await getPosts(
			{ limit: 10, offset: req.query.offset },
			{ userId: id }
		);
        res.status(200).json({
			errorCode: 200,
			errorMessage: "Lấy danh sách bài đăng thành công",
			data: result.data,
            total: result.total,
		});
    } catch (err) {
        console.error("Error while getting posts:", err);
        if (err instanceof Error) {
            res.status(200).json({
                errorCode: 400,
                errorMessage: err.message,
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 400,
                errorMessage: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }
    }
}

const getPostController = async (req: Request, res: Response) => {
    try {
        req.query.offset = req.query.offset || 0;
        const result = await getPosts({ limit: 10, offset: req.query.offset });
        res.status(200).json({
			errorCode: 200,
			errorMessage: "Lấy danh sách bài đăng thành công",
			data: result.data,
            total: result.total,
		});
    } catch (err) {
        console.error("Error while getting posts:", err);
        if (err instanceof Error) {
            res.status(200).json({
                errorCode: 400,
                errorMessage: err.message,
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 400,
                errorMessage: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }
    }
}

const getPostByIdController = async (req:Request, res:Response) => {
    try {
        const { id } = req.params;
        console.log(id);
        const post = await getPostById(id);
        if (!post) {
            res.status(200).json({
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
            res.status(200).json({
                errorCode: 400,
                message: err.message,
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 400,
                message: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }
    }
}

const createPostController = async (req: Request, res: Response) => {
    try {
        const {
            title,
            description,
            content,
            tagId
        } = req.body;

        const userId = req.user._id;
        console.log("User ID from token:", userId);

        // Kiểm tra dữ liệu đầu vào
        if (!title || !content || !userId || !tagId) {
            return res.status(200).json({
                errorCode: 400,
                message: "Vui lòng nhập đầy đủ thông tin bài viết",
                data: null,
            });
        }

        try {
            const post = await createPost({
                title,
                description,
                content,
                url: toSlugWithTimestamp(title), // Tạo slug từ tiêu đề
                status: PostStatus.PENDING,
                totalComments: 0,
                totalUpvote: 0,
                totalDownvote: 0,
                totalShare: 0,
                totalView: 0,
                userId: userId,
                tagId,
            });

            return res.status(200).json({
                errorCode: 200,
                errorMessage: "Tạo bài viết thành công",
                data: post,
            });
        } catch (err){
            console.error("Error while creating post:", err);
            return res.status(200).json({
                errorCode: 400,
                errorMessage: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }

    } catch (err) {
        console.error("Error while creating post:", err);

        if (err instanceof Error) {
            return res.status(200).json({
                errorCode: 400,
                errorMessage: err.message,
                data: null,
            });
        } else {
            return res.status(200).json({
                errorCode: 400,
                errorMessage: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }
    }
};

const updatePostByAdminController = async (req:Request, res:Response) => {
    const {
        title,
        description,
        content,
        url,
        status,
    } = req.body;

    const user = req.user;
    if (user.role !== 1) {
        return res.status(200).json({
            errorCode: 403,
            errorMessage: "Bạn không có quyền thực hiện hành động này",
            data: null,
        });
    }

    const { id } = req.params;

    try {
        const post = await updatePostByAdmin(id, title, description, content, url, status);
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Cập nhật bài viết thành công",
            data: post,
        }
        );
    } catch (err) {
        console.error("Error while updating post:", err);
        if (err instanceof Error) {
            res.status(200).json({
                errorCode: 400,
                message: err.message,
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 400,
                message: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }
    }
}

const updatePostController = async (req:Request, res:Response) => {
    const {
        title,
        description,
        content,
        tagId
    } = req.body;
    const { id } = req.params;
    if (!content || content.trim().length === 0) {
        res.status(200).json({
            errorCode: 400,
            message: "Vui lòng nhập nội dung chỉnh sửa",
            data: null,
        });
        return;
    }

    try {
        const post = await updatePost(id,title,description,content,tagId);
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Cập nhật bài viết thành công",
            data: post,
        }
        );
    } catch (err) {
        console.error("Error while updating post:", err);
        if (err instanceof Error) {
            res.status(200).json({
                errorCode: 400,
                message: err.message,
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 400,
                message: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }
    }
}

const deletePostController = async (req:Request, res:Response) => {
    try {
        const deletedPost = await deletePost(req.params.id);
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Xóa bài viết thành công",
            data: deletedPost,
        });
    } catch (err) {
        console.error("Error while deleting post:", err);
        res.status(200).json({
            errorCode: 400,
            message: err instanceof Error ? err.message : "Lỗi không xác định. Vui lòng thử lại sau.",
            data: null,
        });
    }
}

const searchPostController = async (req:Request, res:Response) => {
    try {
        const offset = req.query.offset || 0;
        const limit = req.query.limit || 10;
        const { postId, userId, content, createdAt, title, description, tagId } = req.body;
        const query: any = {};

        console.log("Search parameters:", req.body);

        if (postId) {
            query.postId = { $regex: postId, $options: 'i' }; // Tìm kiếm postId chứa giá trị
        }
        if (userId) {
            query.userId = { $regex: userId, $options: 'i' }; // Tìm kiếm userId chứa giá trị
        }
        // Tìm kiếm theo title, content, description (OR)
        const orConditions = [];
        if (title) {
            orConditions.push({ title: { $regex: title, $options: 'i' } });
        }
        if (content) {
            orConditions.push({ content: { $regex: content, $options: 'i' } });
        }
        if (description) {
            orConditions.push({ description: { $regex: description, $options: 'i' } });
        }
        if (tagId) {
            orConditions.push({ tagId: { $regex: tagId, $options: 'i' } });
        }
        if (orConditions.length > 0) {
            query.$or = orConditions;
        }
        if (createdAt) {
            const parsedDate = new Date(createdAt as string);
            if (isNaN(parsedDate.getTime())) {
                res.status(200).json({
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

        const posts = await getPosts({offset, limit}, query);
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Lấy bài đắng thành công",
            data: posts.data,
            total: posts.total,
        });
    } catch (err) {
        console.error("Error while searching comments:", err);
        if (err instanceof Error) {
            res.status(200).json({
                errorCode: 400,
                errorMessage: err.message,
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 400,
                errorMessage: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }
    }
}

const acctionBookmarkController = async (req:Request, res:Response) => {
    const userId = req.user._id;
    const { postId } = req.body;

    if (!userId || !postId) {
        return res.status(200).json({
            errorCode: 400,
            message: "Vui lòng nhập đầy đủ thông tin",
            data: null,
        });
    }
    try {
        const acctionBookmark = await actionBookmark(userId, postId);
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Thao tác bookmark thành công",
            action: acctionBookmark,
        });
    } catch (err) {
        console.error("Error while processing request:", err);
        if (err instanceof Error) {
            res.status(200).json({
                errorCode: 400,
                message: err.message,
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 400,
                message: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        } 
    }
}

const getBookmarkByUserId = async (req:Request, res:Response) => {
    const { userId} = req.params;
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;
    if (!userId) {
        return res.status(200).json({
            errorCode: 400,
            message: "Không rõ người dùng",
            data: null,
        });
    }
    try {
        const bookmark = await listBookmarks(userId, offset, limit);
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Lấy danh sách bookmark thành công",
            data: bookmark?.data || [],
            total: bookmark?.total || 0,
        });
    } catch (err) {
        console.error("Error while processing request:", err);
        if (err instanceof Error) {
            res.status(200).json({
                errorCode: 400,
                message: err.message,
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 400,
                message: "Lỗi không xác định. Vui lòng thử lại sau.",
                data: null,
            });
        }
    }
}

export {
    getBookmarkByUserId,
	getPostByAuthor, 
    getPostController,
	acctionBookmarkController,
	getPostByIdController,
	updatePostByAdminController,
	createPostController,
	updatePostController,
	deletePostController,
	searchPostController,
};