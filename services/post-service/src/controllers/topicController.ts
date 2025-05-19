import { getAllTopics,getTopicById,createTopic,deleteTopic,updateTopic,searchTopic

 } from "../services/topicService";
import { Request, Response } from "express";

const getAllTopicsController = async (req: Request, res: Response) => {
    try {
        const topics = await getAllTopics();
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Lấy danh sách chủ đề thành công",
            data: topics,
        });
    } catch (err) {
        console.error("Error while getting topics:", err);
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

const getTopicByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const topic = await getTopicById(id);
        if (!topic) {
            res.status(200).json({
                errorCode: 404,
                message: "Không tìm thấy chủ đề",
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 200,
                errorMessage: "Lấy chủ đề thành công",
                data: topic,
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

const createTopicController = async (req: Request, res: Response) => {
    const user = req.user;
    if(user.role !== 1){
        res.status(200).json({
            errorCode: 403,
            errorMessage: "Bạn không có quyền tạo chủ đề",
            data: null,
        });
        return;
    }
    try {
        const { name, hashtag } = req.body;
        const topic = await createTopic({ name, hashtag});
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Tạo chủ đề thành công",
            data: topic,
        });
    } catch (err) {
        console.error("Error while creating topic:", err);
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

const updateTopicController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, hashtag } = req.body;
        const topic = await updateTopic(id, name, hashtag);
        if (!topic) {
            res.status(200).json({
                errorCode: 404,
                message: "Không tìm thấy chủ đề",
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 200,
                errorMessage: "Cập nhật chủ đề thành công",
                data: topic,
            });
        }
    } catch (err) {
        console.error("Error while updating topic:", err);
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

const deleteTopicController = async (req: Request, res: Response) => {
    const user = req.user;
    if(user.role !== 1){
        res.status(200).json({
            errorCode: 403,
            errorMessage: "Bạn không có quyền xóa chủ đề",
            data: null,
        });
        return;
    }
    try {
        const { id } = req.params;
        const result = await deleteTopic(id);
        if (!result) {
            res.status(200).json({
                errorCode: 404,
                message: "Không tìm thấy chủ đề",
                data: null,
            });
        } else {
            res.status(200).json({
                errorCode: 200,
                errorMessage: "Xóa chủ đề thành công",
                data: null,
            });
        }
    } catch (err) {
        console.error("Error while deleting topic:", err);
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
const searchTopicController = async (req: Request, res: Response) => {
    try {
        const { tagId, name, hashtag, createdAt} = req.body;
        const query: any = {}; // Initialize an empty query object
        if(tagId){
            query.tagId = {$regex: tagId, $options: "i" };
        }
        if(name){
            query.name = {$regex: name, $options: "i" };
        }
        if(hashtag){
            query.hashtag = {$regex: hashtag, $options: "i" };
        }
        if(createdAt){
            const parsedDate = new Date(createdAt as string);
            if (!isNaN(parsedDate.getTime())) {
                res.status(200).json({
                    errorCode: 400,
                    message: "Ngày không hợp lệ",
                    data: null,
                });
                return;
            }
            const startOfDay = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
            const endOfDay = new Date(parsedDate.setUTCHours(23, 59, 59, 999));
            query.createdAt = { $gte: startOfDay, $lte: endOfDay };
            
        }
        
        const topics = await searchTopic(query);
        res.status(200).json({
            errorCode: 200,
            errorMessage: "Tìm kiếm chủ đề thành công",
            data: topics,
        });
    } catch (err) {
        console.error("Error while searching topics:", err);
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

export {
    getAllTopicsController,
    getTopicByIdController,
    createTopicController,
    updateTopicController,
    deleteTopicController,
    searchTopicController
}