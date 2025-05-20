import express from 'express';
import { createPostController, deletePostController, updatePostByAdminController, getPostByIdController, getPostController, searchPostController, updatePostController, acctionBookmarkController, getPostByAuthor } from '../controllers/postController';
import { authenticate } from '../utils/authenticate';

const postRoute = express.Router();

postRoute.get('/', getPostController);


postRoute.post('/save',authenticate ,createPostController);


// Lấy bài viết theo ID
// postRoute.get('/:id', authenticate, getPostByIdController);
postRoute.get("/author/:id", getPostByAuthor);

// Cap nhat bai viet cua quan tri vien
postRoute.put('/admin/:id', authenticate, updatePostByAdminController);

// Cập nhật bài viết
postRoute.put('/:id', updatePostController);

// Xoá bài viết
postRoute.delete('/:id', deletePostController);

// Tim kiem theo nhieu dieu kien theo người dung, bai viet, noi dung, thoi gian
postRoute.post('/search', searchPostController);

// click bookmark
postRoute.post('/actionBookmark', authenticate, acctionBookmarkController);

export default postRoute;