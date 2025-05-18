import axios from "axios";

const POST_SERVICE_URL =
    process.env.POST_SERVICE_URL || "http://api-gateway:3000/api/post";

export const PostClient = {
    getPostById: async (postId: string) => {
        try {
            // chỉnh lại url
            const response = await axios.get(`${POST_SERVICE_URL}/${postId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching post by ID:", error);
            throw error;
        }
    }
}

