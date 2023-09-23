import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import { CartProvider } from './contexts/CartContext';
import CartPage from './pages/CartPage';
import HomePage from './pages/HomePage';import React from 'react';
import { render } from '@testing-library/react';
import ProductCard from '../ProductCard';

const App = () => {
	return (
		<CartProvider>
			<Router>
				<Navbar />
				<Switch>
					<Route path="/" exact component={HomePage} />
					<Route path="/cart" component={CartPage} />
					{/* Add other routes as needed */}
				</Switch>
			</Router>
		</CartProvider>
	);
};

export default App;
