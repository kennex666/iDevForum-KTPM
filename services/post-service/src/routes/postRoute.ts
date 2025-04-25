import express from 'express';
import { createPostController, deletePostController, getPostByIdController, getPostController, searchPostController, updatePostController } from '../controllers/postController';
import { authenticate } from '../utils/authenticate';

const postRoute = express.Router();

postRoute.get('/', getPostController);


postRoute.post('/save',authenticate ,createPostController);


// Lấy bài viết theo ID
postRoute.get('/:id', getPostByIdController);

// Cập nhật bài viết
postRoute.put('/:id', updatePostController);

// Xoá bài viết
postRoute.delete('/:id', deletePostController);

// Tim kiem theo nhieu dieu kien theo người dung, bai viet, noi dung, thoi gian
postRoute.post('/search', searchPostController);

export default postRoute;