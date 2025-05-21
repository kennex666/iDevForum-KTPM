import { Schema, model, Document } from "mongoose";

interface IFollowing extends Document {
	followerId: string;
	followingId: string;
	createdAt: Date;
	updatedAt: Date;
}
// Định nghĩa Schema
const FollowingSchema = new Schema<IFollowing>(
	{
		followerId: {
			type: String,
			required: [true, "followerId is required!"],
		},
		followingId: {
			type: String,
			required: [true, "followingId is required!"],
		},
	},
	{
		timestamps: true, // Tự động thêm createdAt & updatedAt
	}
);

// Tạo Model từ Schema
const FollowingModel = model<IFollowing>("following", FollowingSchema);

export default FollowingModel;
export { IFollowing };
