const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
	products: [
		{
			product: {
				type: mongoose.Schema.ObjectId,
				ref: 'Product',
			},
			quantity: {
				type: Number,
				default: 1,
			},
		},
	],
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
