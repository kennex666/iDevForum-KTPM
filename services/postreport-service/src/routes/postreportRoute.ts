import express from 'express';
import postreportController from '../controllers/postreportController';

const postrepostRoute = express.Router();

// Lấy tất cả báo cáo
postrepostRoute.get('/', postreportController.getPostAllReport);

// Lấy báo cáo theo ID
postrepostRoute.get('/:id', postreportController.getPostReportById);

// Tạo báo cáo mới
postrepostRoute.post('/save', postreportController.createPostReport);

// Cập nhật báo cáo
postrepostRoute.put('/:id', postreportController.updatePostReport);

// Xóa báo cáo
postrepostRoute.delete('/:id', postreportController.deletePostReport);

// Tìm kiếm báo cáo
postrepostRoute.post('/search', postreportController.searchPostReport);

export default postrepostRoute;