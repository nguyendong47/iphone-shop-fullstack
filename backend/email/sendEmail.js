const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: EMAIL,
		pass: EMAIL_PASSWORD,
	},
});

router.post('/send-verification-email', async (req, res) => {
	try {
		const emailToken = crypto.randomBytes(64).toString('hex');
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			return res.status(400).send('Email không tồn tại.');
		}

		// Lưu mã token và thời gian hết hạn vào cơ sở dữ liệu
		user.emailVerificationToken = emailToken;
		user.emailVerificationExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 giờ
		await user.save();

		const emailContent = {
			from: EMAIL,
			to: req.body.email,
			subject: 'Xác thực email',
			text: `Nhấp vào liên kết sau để xác thực email: http://yourwebsite.com/verify/${emailToken}`,
		};

		await transporter.sendMail(emailContent);
		res.status(200).send('Email xác thực đã được gửi!');
	} catch (error) {
		res.status(500).send('Lỗi khi gửi email.');
	}
});

router.get('/verify/:token', async (req, res) => {
	try {
		const user = await User.findOne({
			emailVerificationToken: req.params.token,
			emailVerificationExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.send('Mã xác thực không hợp lệ hoặc đã hết hạn.');
		}

		user.emailVerified = true;
		user.emailVerificationToken = undefined;
		user.emailVerificationExpires = undefined;
		await user.save();

		res.status(200).send('Email đã được xác thực thành công!');
	} catch (error) {
		res.status(500).send('Lỗi khi xác thực email.');
	}
});

module.exports = router;
