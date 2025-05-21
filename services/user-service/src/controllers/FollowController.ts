import { actionFollow } from "../services/followService";

export const followUser = async (req: any, res: any) => {
    const userId = req.user._id;
    const { id } = req.params;
    
    if (!userId || !id) {
        return res.status(400).json({
            errorCode: 400,
            errorMessage: "Follower ID and Following ID are required",
            data: null,
        });
    }
    if (userId === id) {
        return res.status(200).json({
            errorCode: 400,
            errorMessage: "You cannot follow yourself",
            data: null,
         });
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