const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
	const token = req.header('Authorization');

	if (!token) {
		return res
			.status(401)
			.json({ error: 'No authentication token, access denied' });
	}

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified.id;
		next();
	} catch (err) {
		res.status(400).json({
			error: 'Token verification failed, access denied',
		});
	}
};

const unless = (middleware, ...excludedRoutes) => {
	return (req, res, next) => {
		const pathCheck = excludedRoutes.some(
			(routePath) => routePath === req.path
		);
		if (pathCheck) {
			return next();
		} else {
			return middleware(req, res, next);
		}
	};
};

module.exports = {
	authenticate,
	unless,
};
