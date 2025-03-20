import mongoose from "mongoose";
import { config } from "dotenv";
config();

const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || "mongodb://localhost:27017/commentDB"
        );
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;