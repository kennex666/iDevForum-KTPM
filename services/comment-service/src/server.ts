import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import commentRoutes from './routes/commentRoutes';
import reactionRoutes from './routes/reactionRoutes';
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
	})
);

// Add routes


app.get("/ping", (req, res) => {
	res.json({
		errorCode: 200,
		errorMessage: "Pong",
		data: null,
	});
});

app.use("/reaction", reactionRoutes);

app.use('/', commentRoutes);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


