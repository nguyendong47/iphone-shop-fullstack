const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Database connection
const connectDB = require('./config/database');

// Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');
const orderRoutes = require('./routes/orderRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');

// Middleware for authentication and authorization
const {
  authenticate,
  unless,
  authorize,
} = require('./middleware/authMiddleware');

const app = express();

// Middleware setup
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Connect to the database
(async () => {
  try {
    await connectDB();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
})();

// Authentication middleware for specific routes
app.use(
  unless(
    authenticate,
    '/api/auth/login',
    '/api/auth/register',
    '/api/feedback',
  ),
);

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);

// Sample protected route
app.get('/api/some-protected-resource', authorize, (req, res) => {
  res.json({ message: 'Bạn có quyền truy cập.' });
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to iPhone Shop Backend!');
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
