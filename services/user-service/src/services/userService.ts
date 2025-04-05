import UserModel, { IUser } from "../models/User";

const createUser = async (
	name: string,
	role: number,
	accountState: string,
	username: string,
	email: string,
	password: string,
): Promise<IUser> => {
	const CheckExistUser = await UserModel.findOne({ email });
	if (CheckExistUser) throw new Error("Email already exists");
	try {
		const passwordHash = password; // Tạm bỏ hash vì lỗi trên docker
		const user = new UserModel({ name, role, accountState, username, email, password: passwordHash });
		return await user.save();
	} catch (error:any) {
		throw new Error(error.message);
	}

};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
	return await UserModel.findOne({ email });
};


const updateUser = async (id: string, data: any): Promise<IUser | null> => {
	const user = await UserModel.findById(id);
	if (!user) return null;

	for (let key in data) {
		if (data[key].trim() === "")
			throw new Error(`${key} is empty`);
	}
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

const updatePassword = async (id: string, newPassword: string, oldPassword: string): Promise<IUser | null> => {
	try {
		const user = await UserModel.findById(id);
		if (!user) return null;
		const isMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isMatch) throw new Error("Old password is incorrect");
		const passwordHash = await bcrypt.hash(newPassword, 10);
		user.password = passwordHash;
		return await user.save();
	} catch (error: any) {
		throw new Error(error.message);
	}
}
// name, email, username, role, accountState
const searchUsers = async (filters: any): Promise<IUser[]> => {
	try {
		let query: any = {};
		const { name, email, username, role, accountState } = filters;
		if (name) query.name = { $regex: name, $options: "i" };
		if (email) query.email = { $regex: email, $options: "i" };
		if (username) query.username = { $regex: username, $options: "i" };
		if (role !== undefined && !isNaN(role)) query.role = Number(role);
		if (accountState) query.accountState = accountState;
		return await UserModel.find(query);
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export { createUser, getUserByEmail, updateUser, getAllUsers, getUserById, deleteUser, updatePassword, searchUsers };
