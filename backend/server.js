const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const productRoutes = require('./routes/productRoutes');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const {
	authenticate,
	unless,
	authorize,
} = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Kết nối đến cơ sở dữ liệu
connectDB().catch(console.dir);

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(unless(authenticate, '/api/auth/login', '/api/auth/register'));
// Sử dụng middleware Ủy quyền cho một route cụ thể
app.get('/api/some-protected-resource', authorize, (req, res) => {
	// Chỉ được truy cập bởi người dùng có quyền
	res.json({ message: 'Bạn có quyền truy cập.' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
	res.send('Welcome to iPhone Shop Backend!');
});

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
