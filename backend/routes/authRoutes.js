const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
// Route để xử lý xác thực email
router.get('/verify/:token', authController.verifyEmail);
// Route để xử lý yêu cầu đặt lại mật khẩu
router.post('/forgot-password', authController.forgotPassword);
// Route để xử lý việc người dùng đặt lại mật khẩu
router.post('/reset-password/:token', authController.resetPassword);

// Route để tạo mới người dùng
router.post('/users', authController.createUser);

// Route để lấy danh sách người dùng
router.get('/users', authController.getUsers);

// Route để cập nhật thông tin người dùng
router.put('/users/:id', authController.updateUser);

// Route để xóa người dùng
router.delete('/users/:id', authController.deleteUser);

module.exports = router;
