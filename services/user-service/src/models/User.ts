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
// vidu: email:my-email@sub.domain.com
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Định nghĩa Schema
const UserSchema = new Schema<IUser>(
	{
		name: { 
			type: String, 
			required: [true, "name is required!"],
			minlength: [1, 'Name must be at least 1 characters'],
		},
		role: {
			type: Number,
			enum: [0, 1],
			default: 0,
		},
		accountState: {
			type: String,
			enum: ["EXPIRED", "BANNED", "RESTRICTED", "ACTIVE", "WAIT_FOR_ACTIVATION"],
			default: "ACTIVE",
		},
		coverPicture: { 
			type: String 
		},
		description: { 
			type: String 
		},
		username: { 
			type: String, 
			required: false,
			minlength: [6, 'Username must be at least 6 characters'],
		},
		email: { 
			type: String, 
			required: [true, "email is required!"], 
			unique: true, 
			match: [emailRegex, "Invalid email format!, ex:user@example.com"]
		},
		title: { 
			type: String 
		},
		password: { 
			type: String,
			minlength: [6, 'Password must be at least 6 characters'],
			required: [true, "password is required!"]
		},
		profilePicture: { 
			type: String 
		},
		bio: { 
			type: String 
		},
	},
	{
		timestamps: true, // Tự động thêm createdAt & updatedAt
	}
);

// Tạo Model từ Schema
const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
export { IUser };
