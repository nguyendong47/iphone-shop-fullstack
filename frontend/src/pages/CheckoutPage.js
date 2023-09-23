// src/pages/CheckoutPage.js
import axios from 'axios';
import React, { useState } from 'react';

const CheckoutPage = () => {
	const [order, setOrder] = useState({
		address: '',
		paymentMethod: 'Credit Card',
		// Add other necessary fields
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
	};

	const handleCheckout = async () => {
		try {
			// Replace with your checkout endpoint
			await axios.post('http://localhost:5000/api/checkout', order);
			alert('Order placed successfully!');
		} catch (error) {
			console.error('Error placing order', error);
			alert('Failed to place order');
		}
	};

	return (
		<div className="checkout-page">
			<h2>Checkout</h2>
			<form>
				<label>
					Address:
					<input
						type="text"
						name="address"
						value={order.address}
						onChange={handleInputChange}
					/>
				</label>
				<label>
					Payment Method:
					<select
						name="paymentMethod"
						value={order.paymentMethod}
						onChange={handleInputChange}
					>
						<option value="Credit Card">Credit Card</option>
						<option value="PayPal">PayPal</option>
					</select>
				</label>
				<button type="button" onClick={handleCheckout}>
					Place Order
				</button>
			</form>
		</div>
	);
};

export default CheckoutPage;
