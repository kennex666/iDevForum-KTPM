import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import fileRoutes from "./routes/fileRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
console.log('Hello, world!'+ process.env.PORT);

app.use('/api/files', fileRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
