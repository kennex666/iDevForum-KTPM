import axios from "axios";

const USER_SERVICE_URL =
    process.env.USER_SERVICE_URL || "http://api-gateway:3000/api/user";

export const UserClient = {
    getUserById: async (userId: string) => {
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/profile/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw error;
        }
    }
}

