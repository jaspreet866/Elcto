const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

const app = express();

// ─── CORS ───────────────────────────────────────────────────────────────────
const CORS_ORIGINS = [
    'https://elcto-a5a8.onrender.com',
    'https://elcto-self.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173'
];

const allowedOriginPatterns = [
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/,
    /^https:\/\/[a-z0-9-]+\.onrender\.com$/
];

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    return CORS_ORIGINS.includes(origin) || allowedOriginPatterns.some((p) => p.test(origin));
};

app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
}));

// ─── BODY PARSER ─────────────────────────────────────────────────────────────
app.use(express.json());

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', brandRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', reviewRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', orderRoutes);
app.use('/api', contactRoutes);
app.use('/api', vendorRoutes);

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(500).send({ statuscode: 0, error: err.message || 'Internal Server Error' });
});

// ─── DATABASE + SERVER ───────────────────────────────────────────────────────
const PORT = process.env.PORT || 9000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
