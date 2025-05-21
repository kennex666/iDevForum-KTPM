import express from 'express';
import postreportController from '../controllers/postreportController';
import { authenticate } from '../utils/authenticate';

const postrepostRoute = express.Router();

// Lấy tất cả báo cáo
postrepostRoute.get('/',authenticate, postreportController.getPostAllReport);

// Lấy báo cáo theo ID
postrepostRoute.get('/:id',authenticate, postreportController.getPostReportById);

// Tạo báo cáo mới
postrepostRoute.post('/save',authenticate ,postreportController.createPostReport);

// Cập nhật báo cáo
postrepostRoute.put('/:id',authenticate, postreportController.updatePostReport);

// Xóa báo cáo
postrepostRoute.delete('/:id',authenticate, postreportController.deletePostReport);

// Tìm kiếm báo cáo
postrepostRoute.post('/search',authenticate, postreportController.searchPostReport);

export default postrepostRoute;