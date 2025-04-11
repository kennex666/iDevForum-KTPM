import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
}

// Định nghĩa Schema
const UserSchema = new Schema<IUser>(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{
		timestamps: true, // Tự động thêm createdAt & updatedAt
	}
);

// Tạo Model từ Schema
const UserModel = model<IUser>("User", UserSchema);

export default UserModel;
export { IUser };
