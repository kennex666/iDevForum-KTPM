import express from 'express';
import { createPostController, deletePostController, updatePostByAdminController, getPostByIdController, getPostController, searchPostController, updatePostController, acctionBookmarkController, getPostByAuthor, getBookmarkByUserId } from '../controllers/postController';
import { authenticate } from '../utils/authenticate';

const postRoute = express.Router();

postRoute.get('/', getPostController);


postRoute.post('/save',authenticate ,createPostController);


// Lấy bài viết theo ID
postRoute.get("/author/:id", getPostByAuthor);

postRoute.get("/:id", getPostByIdController);

// Cap nhat bai viet cua quan tri vien
postRoute.put('/admin/:id', authenticate, updatePostByAdminController);

// Cập nhật bài viết
postRoute.put("/:id", authenticate, updatePostController);

// Xoá bài viết
postRoute.delete('/:id', deletePostController);

// Tim kiem theo nhieu dieu kien theo người dung, bai viet, noi dung, thoi gian
postRoute.post('/search', searchPostController);

// click bookmark
postRoute.post('/actionBookmark', authenticate, acctionBookmarkController);

// list bookmark from user
postRoute.get('/bookmark/:userId', getBookmarkByUserId);

export default postRoute;