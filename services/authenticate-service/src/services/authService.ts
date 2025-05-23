import UserModel, { IUser } from "../models/User";

const createUser = async (
	name: string,
	email: string,
	password: string
): Promise<IUser> => {
	const user = UserClient;
	return await user.save();
};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
	return await UserModel.findOne({ email });
};

export { createUser, getUserByEmail };