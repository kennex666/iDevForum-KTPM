import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
	try {
		await mongoose.connect(
			process.env.MONGO_URI || "mongodb://localhost:27017/userDB"
		);
		console.log("MongoDB Connected");
	} catch (error) {
		console.error("MongoDB Connection Error:", error);
		process.exit(1);
	}
};

export default connectDB;
