// src/pages/CartPage.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CartPage = () => {
	const [cart, setCart] = useState([]);

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const res = await axios.get('http://localhost:5000/api/cart');
				setCart(res.data);
			} catch (error) {
				console.error('Error fetching cart', error);
			}
		};

		fetchCart();
	}, []);

	const handleRemoveFromCart = async (productId) => {
		try {
			await axios.delete(
				'http://localhost:5000/api/cart/remove-from-cart',
				{
					data: { productId },
				}
			);
			setCart(cart.filter((item) => item.product.id !== productId));
		} catch (error) {
			console.error('Error removing from cart', error);
			alert('Failed to remove product from cart');
		}
	};

	return (
		<div className="cart-page">
			{/* Render Cart Items */}
			{cart.map((item) => (
				<div key={item.product.id}>
					<p>{item.product.name}</p>
					<p>${item.product.price}</p>
					<p>Quantity: {item.quantity}</p>
					<button
						onClick={() => handleRemoveFromCart(item.product.id)}
					>
						Remove
					</button>
				</div>
			))}
		</div>
	);
};

export default CartPage;
