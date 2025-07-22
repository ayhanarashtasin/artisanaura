import express from 'express';
import userRoutes from './routes/authRoutes.js';
import cors from 'cors';
import connectDB from './config/database.js';
import dotenv from 'dotenv';


dotenv.config();

connectDB();

const app = express();


app.use(express.json());
app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true,
 }));
 app.use('/api', userRoutes);

app.get('/', (req, res) => {
      res.send('Hello, World!');
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
      console.log(`Server at http://localhost:${port}`);
});