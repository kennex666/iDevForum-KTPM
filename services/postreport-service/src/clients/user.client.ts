
import axios from "axios";

const POST_SERVICE_URL = process.env.POST_SERVICE_URL || "http://post-service:3002";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://user-service:3006";

export const userClient = {
  async getUserById(userId: string) {
	try {
		const response = await axios.get(`${USER_SERVICE_URL}/profile/${userId}`);
		if (!response.data)
		  return null;
	  	return response.data;
	} catch (error) {
	  console.error("Error fetching user by ID:", error);
	  throw new Error("Failed to fetch user data");
	}
  },
};

export const postClient = {
  async getPostById(postId: string) {
	try {
	  const response = await axios.get(`${POST_SERVICE_URL}/posts/${postId}`);
	  if (!response.data)
		return null;
	  return response.data;
	} catch (error) {
	  console.error("Error fetching post by ID:", error);
	  throw new Error("Failed to fetch post data");
	}
  },
};