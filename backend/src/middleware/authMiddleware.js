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
      (routePath) => routePath === req.path,
    );
    if (pathCheck) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

// Middleware Ủy quyền
const authorize = (req, res, next) => {
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
  if (!req.user) {
    return res
      .status(401)
      .json({ message: 'Không được phép truy cập, vui lòng đăng nhập.' });
  }

  // Kiểm tra quyền truy cập của người dùng, ví dụ:
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Bạn không có quyền truy cập.' });
  }

  // Nếu người dùng có quyền, cho phép truy cập
  next();
};

module.exports = {
  authenticate,
  unless,
  authorize,
};
