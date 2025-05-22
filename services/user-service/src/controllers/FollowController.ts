import { actionFollow, getCountFollower, getFollowingList, isFollower } from "../services/followService";

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

// get total following
export const getAuthorProfileFollower = async (req: any, res:any)  => {
    const {userId, id} = req.query;
    if (!id) {
        return res.status(400).json({
            errorCode: 400,
            errorMessage: "Following ID are required",
            data: null,
        });
    }

    var countFollower = await getCountFollower(id);
    var isFollowing = false; 
    if (userId) {
        isFollowing = await isFollower(userId, id);
    }

    return res.status(200).json({
        errorCode: 200,
        errorMessage: "Get author profile successfully",
        data: {
            targetId: id,
            totalFollower: countFollower,
            isFollowing
        },
    });
}

export const getFollowingUserIds = async (req: any, res: any) => {
	try {
		const userId = req.user._id;
		if (!userId) {
			return res.status(200).json({
				errorCode: 401,
				errorMessage: "Bạn chưa đăng nhập",
				data: null,
			});
		}

		const followingIds = await getFollowingList(userId);

		return res.status(200).json({
			errorCode: 200,
			errorMessage: "Lấy danh sách đang theo dõi thành công",
			data: followingIds,
		});
	} catch (err) {
		console.error("Error fetching following list:", err);
		return res.status(200).json({
			errorCode: 500,
			errorMessage: "Lỗi khi lấy danh sách following",
			data: null,
		});
	}
};
