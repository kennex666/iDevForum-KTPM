import axios from "axios";

const COMMENT_SERVICE_URL =
    process.env.COMMENT_SERVICE_URL || "http://api-gateway:3000/api/comment";

export const CommentClient = {
    getCommentById: async (commentId: string) => {
        try {
            const response = await axios.get(`${COMMENT_SERVICE_URL}/comment/${commentId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching comment by ID:", error);
            throw error;
        }
    },
}