const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Tạo và gửi email xác thực
exports.sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('Email không tồn tại.');
    }

    const emailToken = crypto.randomBytes(64).toString('hex');
    user.emailVerificationToken = emailToken;
    user.emailVerificationExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 giờ
    await user.save();

    const emailContent = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Xác thực email',
      text: `Nhấp vào liên kết sau để xác thực email: http://yourwebsite.com/verify/${emailToken}`,
    };

    await transporter.sendMail(emailContent);
    res.status(200).send('Email xác thực đã được gửi!');
  } catch (error) {
    res.status(500).send('Lỗi khi gửi email.');
  }
};

// Xác thực email
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      emailVerificationToken: req.params.token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send('Mã xác thực không hợp lệ hoặc đã hết hạn.');
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).send('Email đã được xác thực thành công!');
  } catch (error) {
    res.status(500).send('Lỗi khi xác thực email.');
  }
};
