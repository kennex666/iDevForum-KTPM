import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
	name: string,
	role: number,
	accountState: string,
	coverPicture: string,
	description: string,
	username: string,
	email: string;
	title: string,
	password: string;
	profilePicture: string,
	bio: string,
	createdAt: Date;
	updatedAt: Date;
}

// Định nghĩa Schema
const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		role: {
			type: Number,
			enum: [0, 1],
			default: 0,
		},
		accountState: {
			type: String,
			enum: ["EXPIRED", "BANNED", "RESTRICTED", "ACTIVE", "WAIT_FOR_ACTIVATION"],
			default: "WAIT_FOR_ACTIVATION",
		},
		coverPicture: { type: String },
		description: { type: String },
		username: { type: String, required: true, unique: false },
		email: { type: String, required: true, unique: true },
		title: { type: String },
		password: { type: String, required: true },
		profilePicture: { type: String },
		bio: { type: String },
	},
	{
		timestamps: true, // Tự động thêm createdAt & updatedAt
	}
);

// Tạo Model từ Schema
const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
export { IUser };
