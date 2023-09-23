// src/pages/HomePage.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const res = await axios.get(
					'http://localhost:5000/api/products'
				);
				setProducts(res.data);
			} catch (error) {
				console.error('Error fetching products', error);
			}
		};

		fetchProducts();
	}, []);

	return (
		<div className="home-page">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
};

export default HomePage;
