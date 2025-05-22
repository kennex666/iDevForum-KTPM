import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import postRoute from './routes/postRoute';
import topicRoute from './routes/topicRoute';
import cors from 'cors';
const RABBITMQ_URL = "amqp://rabbitmq:5672";
import amqp from "amqplib";
import { PostModel } from './models/postModel';

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

const startResultConsumer = async () => {
	const conn = await amqp.connect(RABBITMQ_URL);
	const channel = await conn.createChannel();

	const queue = "review_result";
	await channel.assertQueue(queue, { durable: true });

	channel.consume(queue, async (msg) => {
		if (msg !== null) {
			const result = JSON.parse(msg.content.toString());
			console.log("📥 Kết quả duyệt:", result);

			await PostModel.findByIdAndUpdate(result.postId, {
				status: result.status === 200 ? "PUBLISHED" : "PENDING",
				reviewMessage: result.message,
			});

			channel.ack(msg);
		}
	});
};

startResultConsumer();