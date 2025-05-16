import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import postreportRoute from './routes/postreportRoute';

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

app.use('/postreports', postreportRoute);
const PORT = process.env.PORT || 3007;

connectDB().then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});