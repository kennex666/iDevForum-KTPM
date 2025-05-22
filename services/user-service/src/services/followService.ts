import FollowingModel, { IFollowing } from "../models/Following"
import UserModel from "../models/User";

export const actionFollow = async (followerId: string, followingId: string) => {
    const data = {
        followerId,
        followingId
    } as IFollowing;

    if (!followerId || !followingId) {
        throw new Error("Follower ID and Following ID are required");
    }
    if (followerId === followingId) {
        throw new Error("You cannot follow yourself");
    }

    const isUserExist = await UserModel.findById(followingId);

    if (!isUserExist) {
        throw new Error("User not found");
    }
    
    const isExist = await FollowingModel.findOne({
        followerId,
        followingId
    });

    if (isExist) {
        const result = await FollowingModel.deleteOne({
            followerId,
            followingId
        });
        if (result.deletedCount === 0) {
            throw new Error("Unfollow user failed");
        }
        return {
            errorCode: 200,
            errorMessage: "Unfollow user successfully",
            action: "unfollow",
        };
    }

    const response = FollowingModel.create(data);
    if (!response) {
        throw new Error("Follow user failed");
    }
    return {
        errorCode: 200,
        errorMessage: "Follow user successfully",
        action: "follow",
    };
}

export const getFollowerList = async (userId: string) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const result = await FollowingModel.find({ followingId: userId });
    return result;
}

export const getCountFollower = async (userId: string) => {
    if (!userId) {
        throw new Error("User ID is required");
    }
    const result = await FollowingModel.countDocuments({ followingId: userId }).catch(() => 0);
    const total = result || 0;
    return total;
}

export const isFollower = async (userId: string, targetId: string) => {
    if (!userId || !targetId) {
		throw new Error("User ID is required");
	}
    const result = await FollowingModel.find({
		followerId: userId,
		followingId: targetId,
	}).catch(() => []);
    return result.length > 0;
}