import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import bookmarkRoute from './routes/bookmarkRoute';

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

app.use('/bookmarks', bookmarkRoute);
const PORT = process.env.PORT || 3008;

connectDB().then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});