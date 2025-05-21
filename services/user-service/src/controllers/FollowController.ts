import { actionFollow } from "../services/followService";

export const followUser = async (req: any, res: any) => {
    const userId = req.user._id;
    const { id } = req.params;
    
    if (!userId || !id) {
        return res.status(400).json({ message: "User ID and Follow ID are required" });
    }
    if (userId === id) {
        return res.status(400).json({ message: "You cannot follow yourself" });
    }
    
    try {
        const response = await actionFollow(userId, id);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(200).json({
			errorCode: 500,
			errorMessage: (error as Error).message,
			data: null,
		});
    }
}