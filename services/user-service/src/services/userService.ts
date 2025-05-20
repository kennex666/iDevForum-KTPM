import { Types } from 'mongoose';
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
	if (CheckExistUser) throw new Error("Email already exists!");
	try {
		const passwordHash = password; // Tạm bỏ hash vì lỗi trên docker
		const user = new UserModel({
			name,
			role,
			accountState,
			username,
			email,
			password: passwordHash,
			profilePicture: "/assets/img/avt-default.png",
			coverPicture: "https://picsum.photos/1000/300",
		});
		return await user.save();
	} catch (error: any) {
		throw new Error(error.message);
	}
};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
	return await UserModel.findOne({ email });
};


const updateUser = async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
	if (!Types.ObjectId.isValid(id)) throw new Error("ID is not in valid format!");
	if ('password' in updateData) {
		delete updateData.password;
	}
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const usernameRegex = /^[a-zA-Z0-9]{6,}$/;
	const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
	// Loại bỏ các thuộc tính rỗng trong updateData
    Object.keys(updateData).forEach((key) => {
        const value = updateData[key as keyof IUser];
        if (value === null || value === undefined || value === "") {
            delete updateData[key as keyof IUser];
        }
    });
	if (updateData.email && !emailRegex.test(updateData.email)) throw new Error("Email is not in valid format!");
	if (updateData.username && !usernameRegex.test(updateData.username)) throw new Error("Username is not in valid format!");
	if (updateData.name && !nameRegex.test(updateData.name)) throw new Error("Name is not in valid format!");
	if (updateData.role && ![0, 1].includes(updateData.role)) throw new Error("Role is not in valid format!");
	if (updateData.accountState && !["EXPIRED", "BANNED", "RESTRICTED", "ACTIVE", "WAIT_FOR_ACTIVATION"].includes(updateData.accountState)) throw new Error("Account state is not in valid format!");
	const userUpdate = await UserModel.findByIdAndUpdate(id, updateData, { new: true });
	if (!userUpdate) throw new Error("User not found!");
	return userUpdate;
};

const getAllUsers = async (): Promise<IUser[]> => {
	return await UserModel.find();
}

const getUserById = async (id: string): Promise<IUser | null> => {
	if (!Types.ObjectId.isValid(id)) throw new Error("ID is not in valid format!");
	return await UserModel.findById(id);
}

const deleteUser = async (id: string): Promise<IUser | null> => {
	if (!Types.ObjectId.isValid(id)) throw new Error("ID is not in valid format!");
	// Check if user exists
	const user = await UserModel.findById(id);
	if (!user) throw new Error("User not found!");
	await UserModel.findByIdAndDelete(id);
	return user;
}

const updatePassword = async (id: string, newPassword: string, oldPassword: string): Promise<IUser | null> => {
	try {
		const user = await UserModel.findById(id);
		if (!user) throw new Error("User not found!");
		// const isMatch = await bcrypt.compare(oldPassword, user.password);
		const isMatch = oldPassword === user.password; // Tạm bỏ hash vì lỗi trên docker
		if (!isMatch) throw new Error("Old password is incorrect");
		// const passwordHash = await bcrypt.hash(newPassword, 10);
		const passwordHash = newPassword; // Tạm bỏ hash vì lỗi trên docker
		user.password = passwordHash;
		return await user.save();
	} catch (error: any) {
		throw new Error(error.message);
	}
}
// name, email, username, role, accountState
const searchUsers = async (filters: any): Promise<IUser[]> => {
	// filters: { name, email, username, role, accountState }
	try {
		return await UserModel.find(filters).select("-password -__v").sort({ createdAt: -1 });
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export { createUser, getUserByEmail, updateUser, getAllUsers, getUserById, deleteUser, updatePassword, searchUsers };
