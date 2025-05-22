import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import thirdPartyRoute from './routes/thirdPartyRoute';
// reviewWorker.ts
import amqp from "amqplib";
import { reviewPostQueue } from './controllers/aiController';

const RABBITMQ_URL = "amqp://rabbitmq:5672";
dotenv.config();
const app = express();

console.log('Hello, world!'+ process.env.PORT);

app.use(express.json());

// Add routes

app.get("/ping", (req, res) => {
	res.json({
		errorCode: 200,
		errorMessage: "Pong pong",
		data: null,
	});
});

app.use('/', thirdPartyRoute);
const PORT = process.env.PORT || 3004;

const startReviewConsumer = async () => {
	let retries = 15;
	while (retries > 0) {
		try {
			const conn = await amqp.connect(RABBITMQ_URL);
			const channel = await conn.createChannel();

			const queue = "review_post";
			await channel.assertQueue(queue, { durable: true });

			console.log("✅ [RabbitMQ] Đã kết nối và chờ nhận bài viết...");

			channel.consume(queue, async (msg) => {
				if (msg !== null) {
					const data = JSON.parse(msg.content.toString());
					console.log("📩 Nhận bài viết!");

					const resultReview = await reviewPostQueue(msg.content);

					const resultQueue = "review_result";
					await channel.assertQueue(resultQueue, { durable: true });

					const result = {
						postId: data.postId,
						...resultReview,
					};

					channel.sendToQueue(
						resultQueue,
						Buffer.from(JSON.stringify(result)),
						{
							persistent: true,
						}
					);
					channel.ack(msg);
				}
			});
			break; // Kết nối thành công thì thoát khỏi vòng lặp
		} catch (error) {
			console.error("❌ Kết nối RabbitMQ thất bại:", error.message);
			retries--;
			console.log(`🔁 Thử lại kết nối trong 5s... (${5 - retries}/5)`);
			await new Promise((res) => setTimeout(res, 5000));
		}
	}
};

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
	startReviewConsumer();
});