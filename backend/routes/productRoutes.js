const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Route to insert demo data
router.post('/demo', async (req, res) => {
	try {
		const demoProduct = new Product({
			name: 'iPhone 13',
			description: 'Latest iPhone model with A15 chip',
			price: 999,
			imageUrl: 'https://apple.com/iphone-13-image.jpg',
			stock: 100,
		});

		const savedProduct = await demoProduct.save();
		res.json(savedProduct);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
