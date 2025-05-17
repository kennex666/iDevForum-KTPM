import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import postRoute from './routes/postRoute';
import topicRoute from './routes/topicRoute';
import { cp } from 'fs';
import cors from 'cors';

dotenv.config();
const app = express();

console.log('Hello, world!'+ process.env.PORT);

app.use(express.json());
app.use(cors(
	{
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization', 'user'],
	}
));

// Add routes

app.get("/ping", (req, res) => {
	res.json({
		errorCode: 200,
		errorMessage: "Pong",
		data: null,
	});
});

app.use('/topics', topicRoute);
app.use('/posts', postRoute);

const PORT = process.env.PORT || 3002;

connectDB().then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});