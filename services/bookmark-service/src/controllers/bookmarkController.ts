import BookMarkService from '../services/bookmarkService';
import { Request, Response } from 'express';

class BookMarkController {
    async getAllBookMark(req: Request, res: Response) {
        try {
            const report = await BookMarkService.getAllBookmarks();
            res.status(200).json({
                errorCode: 200,
                message: 'Get all BookMark successfully',
                data: report
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

    async getBookMarkById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const report = await BookMarkService.getBookmarkById(id);
            res.status(200).json({
                errorCode: 200,
                message: 'Get BookMark by id successfully',
                data: report
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

    async createBookMark(req: Request, res: Response) {
        try {
            const {userId,postId} = req.body;
            const report = await BookMarkService.createBookmark({
                userId,
                postId
                
            });
            res.status(200).json({
                errorCode: 200,
                message: 'Create BookMark successfully',
                data: report
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

    async updateBookMark(req: Request, res: Response) { 
        try {
            const { id } = req.params;
            const { postId } = req.body;
            const report = await BookMarkService.updateBookmark(id, postId)
            res.status(200).json({
                errorCode: 200,
                message: 'Update BookMark successfully',
                data: report
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

    async deleteBookMark(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const report = await BookMarkService.deleteBookmark(id)
            res.status(200).json({
                errorCode: 200,
                message: 'Delete book mark successfully',
                data: report
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

    async searchBookMark(req: Request, res: Response) {
        try {
            const {postId, createdAt} = req.body;
            const query: any = {};
            if (postId) {
                query.postId = { $regex: postId, $options: 'i' };
            }
            if(createdAt){
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

            const report = await BookMarkService.searchBookmarks(query);
            res.status(200).json({  
                    errorCode: 200,
                    message: 'Search BookMark successfully',
                    data: report
                });
        } catch (error) {
            if (error instanceof Error) {
                res.status(200).json({
                    errorCode: 400,
                    errorMessage: error.message,
                    data: null,
                });
            }
            else {
                res.status(200).json({
                    errorCode: 400,
                    errorMessage: "Lỗi không xác định. Vui lòng thử lại sau.",
                    data: null,
                });
            }
        }
    }
};

export default new BookMarkController();