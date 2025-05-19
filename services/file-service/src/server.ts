import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import fileRoutes from "./routes/fileRoutes";
import path from "path";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
console.log('Hello, world!'+ process.env.PORT);

app.use('/image', express.static(path.join(__dirname, '../uploads')));
app.use('/', fileRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});