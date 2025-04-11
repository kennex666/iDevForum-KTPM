import mongoose from "mongoose";
import { config } from "dotenv";
config();

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI || "mongodb://localhost:27017/postDB"
        );
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;