// src/components/__tests__/ProductCard.test.js
import { render } from '@testing-library/react';
import React from 'react';
import ProductCard from '../ProductCard';

test('renders product name', () => {
	const product = { name: 'iPhone', description: 'A phone', price: 699 };
	const { getByText } = render(<ProductCard product={product} />);
	expect(getByText('iPhone')).toBeInTheDocument();
});
