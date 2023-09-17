const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const productRoutes = require('./routes/productRoutes');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().catch(console.dir);

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
	res.send('Welcome to iPhone Shop Backend!');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
