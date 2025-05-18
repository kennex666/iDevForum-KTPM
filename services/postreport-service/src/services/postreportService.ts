import { IPostReport, PostReportModel } from "../models/postreportModel";
import { PostReportState } from "../models/postreportState";

class PostReportService {
    async getAllPostReports(): Promise<IPostReport[]> {
        return await PostReportModel.find();
    }

    async getPostReportById(id: string): Promise<IPostReport | null> { 
        try {
            const postReport = await PostReportModel.findById(id);
            return postReport;
        } catch (error) {
            console.error("Error while fetching post repost:", error);
            throw new Error("Không thể tìm thấy bài đăng. Vui lòng thử lại sau.");
        }
    }

    async createPostReport(postReportData: {
        reason: string;
        state: PostReportState;
        postId: string;
        reporterId: string;
        inspectorId: string;
    }): Promise<IPostReport> {
        try {

            const postReport = new PostReportModel(postReportData);
            return await postReport.save();
        } catch (err) {
            console.error("Error creating post repost:", err);
            if (err instanceof Error) {
                throw new Error("Không thể tạo bài đăng. Vui lòng thử lại sau.");
            } else {
                throw new Error("Lỗi không xác định. Vui lòng thử lại sau.");
            }
        }
    }

    // thay doi trang thai cua post repost
    async updatePostReport(id: string, state: PostReportState): Promise<IPostReport | null> {
        try {
            return await PostReportModel.findByIdAndUpdate(id, { state }, { new: true });  // new: true returns the updated document
        } catch (error) {
            console.error("Error while updating post repost:", error);
            throw new Error("Không thể cập nhật bài đăng. Vui lòng thử lại sau.");
        }
    }

    async deletePostReport(id: string): Promise<boolean> {
        try {
            const result = await PostReportModel.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            console.error("Error while deleting post repost:", error);
            throw new Error("Không thể xóa bài đăng. Vui lòng thử lại sau.");
        }
    }

    async searchPostReport(query: any): Promise<IPostReport[]> {
        try {
            return await PostReportModel.find(query);
        } catch (error) {
            console.error("Error while searching post repost:", error);
            throw new Error("Không thể tìm kiếm bài đăng. Vui lòng thử lại sau.");
        }
    }
}

export default new PostReportService();