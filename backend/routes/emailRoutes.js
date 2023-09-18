const express = require('express');
const router = express.Router();
const {
	sendVerificationEmail,
	verifyEmail,
} = require('../controllers/emailController');

// Route để gửi email xác thực
router.post('/send-verification-email', sendVerificationEmail);

// Route để xác thực email thông qua token
router.get('/verify/:token', verifyEmail);

module.exports = router;
