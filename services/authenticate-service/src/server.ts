import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";

dotenv.config();
const app = express();

app.use(express.json()); // Middleware xử lý JSON
app.use("/api/auth", authRoutes);

// Kết nối DB và chạy server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
