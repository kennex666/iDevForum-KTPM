// clients/post.client.ts
import axios from "axios";

const POST_SERVICE_URL =
	process.env.POST_SERVICE_URL || "http://user-service:3006";

export const UserClient = {
	createUser: async (data: any) => {
		const res = await axios.post(`${POST_SERVICE_URL}/user`, data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.status !== 201) {
            throw new Error("Failed to create user");
        }
		return res.data;
	},
};
