import { TopicModel,ITopic } from "../models/topicModel";

const getAllTopics = async (): Promise<ITopic[]> => {
    return await TopicModel.find();
}

const getTopicById = async (id: string): Promise<ITopic | null> => {
    try {
        const topic = await TopicModel.findById(id);
        return topic; 
    } catch (error) {
        console.error("Error while fetching topic:", error);
        throw new Error("Không thể tìm thấy chủ đề. Vui lòng thử lại sau.");
    }
}

const createTopic = async (topicData: {
    name: string;
    hashtag: string;
}): Promise<ITopic> => {
    try {
        const topic = new TopicModel(topicData);
        return await topic.save();
    } catch (err) {
        console.error("Error creating topic:", err);
        if (err instanceof Error) {
            throw new Error("Không thể tạo chủ đề. Vui lòng thử lại sau.");
        } else {
            throw new Error("Lỗi không xác định. Vui lòng thử lại sau.");
        }
    }
};

const updateTopic = async (id: string, name: string, hashtag: string): Promise<ITopic | null> => {
    try {
        return await TopicModel.findByIdAndUpdate(id, { name, hashtag}, { new: true });  // new: true returns the updated document
    } catch (error) {
        console.error("Error while updating topic:", error);
        throw new Error("Không thể cập nhật chủ đề. Vui lòng thử lại sau.");
    }
}
const deleteTopic = async (id: string): Promise<boolean> => {
    try {
        const result = await TopicModel.findByIdAndDelete(id);
        return result !== null;
    } catch (error) {
        console.error("Error while deleting topic:", error);
        throw new Error("Không thể xóa chủ đề. Vui lòng thử lại sau.");
    }   
}

const searchTopic = async (query: any): Promise<ITopic[]> => {
    try {
        const topics = await TopicModel.find(query);
        return topics;
    } catch (error) {
        console.error("Error while searching topic:", error);
        throw new Error("Không thể tìm thấy chủ đề. Vui lòng thử lại sau.");
    }
}

export {
    getAllTopics,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic,
    searchTopic
}

