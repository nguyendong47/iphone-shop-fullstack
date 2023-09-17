const express = require('express');
const router = express.Router();
const {
	register,
	login,
	verifyEmail,
	forgotPassword,
	resetPassword,
	createUser,
	getUsers,
	updateUser,
	deleteUser,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
// Route để xử lý xác thực email
router.get('/verify/:token', verifyEmail);
// Route để xử lý yêu cầu đặt lại mật khẩu
router.post('/forgot-password', forgotPassword);
// Route để xử lý việc người dùng đặt lại mật khẩu
router.post('/reset-password/:token', resetPassword);

// Route để tạo mới người dùng
router.post('/users', createUser);

// Route để lấy danh sách người dùng
router.get('/users', getUsers);

// Route để cập nhật thông tin người dùng
router.put('/users/:id', updateUser);

// Route để xóa người dùng
router.delete('/users/:id', deleteUser);

module.exports = router;
