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

	getUserViaEmail: async (email: string) => {
		const res = await axios.post(`${POST_SERVICE_URL}/search-email?password=true`, // showpassword is used to get the password for login
			{
				email
			}
		);
		return res.data;
	}
};
