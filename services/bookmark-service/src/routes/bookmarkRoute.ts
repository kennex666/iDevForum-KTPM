import express from 'express';
import bookmarkController from '../controllers/bookmarkController';

const bookmarkRoute = express.Router();

// Lấy tất cả báo cáo
bookmarkRoute.get('/', bookmarkController.getAllBookMark);

// Lấy báo cáo theo ID
bookmarkRoute.get('/:id', bookmarkController.getBookMarkById);

// Tạo báo cáo mới
bookmarkRoute.post('/save', bookmarkController.createBookMark);

// Cập nhật báo cáo
bookmarkRoute.put('/:id', bookmarkController.updateBookMark);

// Xóa báo cáo
bookmarkRoute.delete('/:id', bookmarkController.deleteBookMark);

// Tìm kiếm báo cáo
bookmarkRoute.post('/search', bookmarkController.searchBookMark);

export default bookmarkRoute;