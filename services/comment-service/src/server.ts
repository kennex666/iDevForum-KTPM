import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database';
import commentRoutes from './routes/commentRoutes';

dotenv.config();
const app = express();

console.log('Hello, world!'+ process.env.PORT);

app.use(express.json());

// Add routes
app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 3001;

connectDB().then(() => {
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});


