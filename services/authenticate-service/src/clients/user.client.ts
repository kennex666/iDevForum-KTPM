// clients/post.client.ts
import axios from "axios";

// JWT Token embed in the request header


const POST_SERVICE_URL =
	process.env.POST_SERVICE_URL || "http://api-gateway:3000/api/user";

export const UserClient = {
	createUser: async (data: any) => {
		const res = await axios.post(`${POST_SERVICE_URL}/register`, data, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${data.token}` // JWT token
			},
		});
		return res.data;
	},

	getUser: async (id: string) => {
		const res = await axios.get(`${POST_SERVICE_URL}/user/${id}`);
		return res.data;
	}
};
