import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js'; // 1. Import product routes
import chatbotRoutes from './routes/chatbotRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/adminRoutes.js';
import helpRoutes from './routes/helpRoutes.js';
// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// --- Middleware Setup ---

// Enable CORS for your frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

// 2. Serve static files from the 'uploads' directory
// This makes images accessible via URLs like http://localhost:3000/uploads/filename.jpg
app.use('/uploads', express.static('uploads'));


// --- API Routes ---

// Use authentication routes, prefixed with /api
app.use('/api', authRoutes);

// 3. Use product routes, prefixed with /api/products
app.use('/api/products', productRoutes);

app.use('/api/chatbot', chatbotRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/help', helpRoutes);
// --- Server Initialization ---

// A simple root route to confirm the server is running
app.get('/', (req, res) => {
  res.send('ArtisanAura API is running...');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
