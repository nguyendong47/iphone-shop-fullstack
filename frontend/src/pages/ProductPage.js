// src/pages/ProductPage.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState(null);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await axios.get(
					`http://localhost:5000/api/products/${productId}`
				);
				setProduct(res.data);
			} catch (error) {
				console.error('Error fetching product', error);
			}
		};

		fetchProduct();
	}, [productId]);

	if (!product) return <p>Loading...</p>;

	const handleAddToCart = async () => {
		try {
			await axios.post('http://localhost:5000/api/cart/add-to-cart', {
				productId: product.id,
				quantity: 1, // or the selected quantity
			});
			alert('Product added to cart!');
		} catch (error) {
			console.error('Error adding to cart', error);
			alert('Failed to add product to cart');
		}
	};

	return (
		<div className="product-page">
			<img src={product.image} alt={product.name} />
			<h2>{product.name}</h2>
			<p>{product.description}</p>
			<p>${product.price}</p>
			<button onClick={handleAddToCart}>Add to Cart</button>
		</div>
	);
};

export default ProductPage;
