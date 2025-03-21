import UserModel, { IUser } from "../models/User";
const bcrypt = require("bcrypt");

const createUser = async (
	name: string,
	role: number,
	accountState: string,
	username: string,
	email: string,
	password: string,
): Promise<IUser> => {
	const passwordHash = await bcrypt.hash(password, 10);
	const user = new UserModel({ name, role, accountState, username, email, password: passwordHash });
	return await user.save();
};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
	return await UserModel.findOne({ email });
};


const updateUser = async (id: string, data: any): Promise<IUser | null> => {
	const user = await UserModel.findById(id);
	if (!user) return null;
	Object.assign(user, data); // cập nhập dữ liệu mới nếu có thay đổi
	return await user.save();
};

const getAllUsers = async (): Promise<IUser[]> => {
	return await UserModel.find();
}

const getUserById = async (id: string): Promise<IUser | null> => {
	return await UserModel.findById(id);
}

const deleteUser = async (id: string): Promise<IUser | null> => {
	const user = await UserModel.findById(id);
	if (!user) return null;
	await UserModel.findByIdAndDelete(id);
	return user;
}

const updatePassword = async (id: string, newPassword: string,oldPassword:string): Promise<IUser | null> => {
	const user = await UserModel.findById(id).select("+password");
	if (!user) return null;
	const isMatch = await bcrypt.compare(oldPassword, user.password);
	if (!isMatch) return null;
	const passwordHash = await bcrypt.hash(newPassword, 10);
	user.password = passwordHash;
	return await user.save();
}

export { createUser, getUserByEmail };
