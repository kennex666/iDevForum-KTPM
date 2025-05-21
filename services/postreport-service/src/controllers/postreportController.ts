import { PostReportState } from "../models/postreportState";
import postReportService from "../services/postreportService"
import { Request, Response } from 'express';

class PostReportController {
    async getPostAllReport(req: Request, res: Response) {
        const user = req.user;
        if(user.role !== 1) {
            return res.status(403).json({
                errorCode: 403,
                errorMessage: "Bạn không có quyền truy cập vào tài nguyên này.",
                data: null,
            });
        }

        try {
            const report = await postReportService.getAllPostReports();
            res.status(200).json({
                errorCode: 200,
                message: 'Get all post report successfully',
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

    async getPostReportById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const report = await postReportService.getPostReportById(id)
            res.status(200).json({
                errorCode: 200,
                message: 'Get post report by id successfully',
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

    async createPostReport(req: Request, res: Response) {
        try {
            const { reason, postId} = req.body;
            const state = PostReportState.PROCCESSING;
            const userId = req.user._id;

            // check all if empty
            if (!reason || !postId || !userId) {
                return res.status(200).json({
                    errorCode: 400,
                    errorMessage: "Thiếu thông tin cần thiết",
                    data: null,
                });
            }


            const report = await postReportService.createPostReport({
                reason,
                state,
                postId,
                reporterId: userId,
                inspectorId: "",
            });

            if (report && report?.errorCode) {
				return res.status(200).json({
					errorCode: 201,
					errorMessage: "Bài viết đã có người báo cáo trước đó",
					data: report,
				});
			}
            
            res.status(200).json({
                errorCode: 200,
                message: 'Đã báo cáo bài viết thành công!',
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

    async updatePostReport(req: Request, res: Response) { 
        const user = req.user;
        if(user.role !== 1) {
            return res.status(403).json({
                errorCode: 403,
                errorMessage: "Bạn không có quyền truy cập vào tài nguyên này.",
                data: null,
            });
        }
        try {
            const { id } = req.params;
            const { state } = req.body;
            const report = await postReportService.updatePostReport(id, state)
            res.status(200).json({
                errorCode: 200,
                message: 'Update post report successfully',
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

    async deletePostReport(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const report = await postReportService.deletePostReport(id)
            res.status(200).json({
                errorCode: 200,
                message: 'Delete post report successfully',
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

    async searchPostReport(req: Request, res: Response) {
        try {
            const {postreportId, state, reason, postId, reporterId, inspectorId, createdAt} = req.body;
            const query: any = {};
            if (postreportId) {
                query.postrepostId = { $regex: postreportId, $options: 'i' };
            }
            if (state) {
                query.state = { $regex: state, $options: 'i' };
            }
            if (reason) {
                query.reason = { $regex: reason, $options: 'i' };
            }
            if (postId) {
                query.postId = { $regex: postId, $options: 'i' };
            }
            if (reporterId) {
                query.reposterId = { $regex: reporterId, $options: 'i' };
            }
            if (inspectorId) {
                query.inspectorId = { $regex: inspectorId, $options: 'i' };
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

            const report = await postReportService.searchPostReport(query);
            res.status(200).json({  
                    errorCode: 200,
                    message: 'Search post report successfully',
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

export default new PostReportController();