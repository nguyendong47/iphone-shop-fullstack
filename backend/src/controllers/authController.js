const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ error: message });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendErrorResponse(res, 400, 'Email already exists');
    }

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    sendErrorResponse(res, 500, err.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendErrorResponse(res, 400, 'Invalid email or password');
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    sendErrorResponse(res, 500, err.message);
  }
};

// Hàm xử lý xác thực email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Tìm người dùng có mã xác thực tương ứng
    const user = await User.findOne({ emailToken: token });

    // Kiểm tra nếu không tìm thấy hoặc mã xác thực đã hết hạn
    if (!user || user.emailTokenExpires < Date.now()) {
      return res.status(400).json({
        message: 'Liên kết xác thực không hợp lệ hoặc đã hết hạn.',
      });
    }

    // Cập nhật trạng thái xác thực của người dùng
    user.isEmailVerified = true;
    user.emailToken = null;
    user.emailTokenExpires = null;
    await user.save();

    // Điều hướng người dùng đến trang xác thực thành công hoặc trang chính
    // (tùy thuộc vào yêu cầu của bạn)
    res.redirect('/verification-success'); // Điều hướng đến trang xác thực thành công
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình xác thực.',
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('Email không tồn tại.');
    }

    const resetToken = crypto.randomBytes(64).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 giờ
    await user.save();

    const emailContent = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Đặt lại mật khẩu',
      text: `Nhấp vào liên kết sau để đặt lại mật khẩu: http://yourwebsite.com/reset-password/${resetToken}`,
    };

    await transporter.sendMail(emailContent);
    res.status(200).send('Email đặt lại mật khẩu đã được gửi!');
  } catch (error) {
    res.status(500).send('Lỗi khi gửi email đặt lại mật khẩu.');
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  try {
    // Tìm người dùng theo mã xác thực đặt lại mật khẩu
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
      });
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp.',
      });
    }

    // Cập nhật mật khẩu mới cho người dùng
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpires = null;
    await user.save();

    res.json({ message: 'Mật khẩu đã được đặt lại thành công.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình đặt lại mật khẩu.',
    });
  }
};

exports.createUser = async (req, res) => {
  // Nhận thông tin người dùng từ req.body
  const { username, email, password } = req.body;

  try {
    // Tạo mới người dùng
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      message: 'Người dùng đã được tạo mới thành công.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình tạo mới người dùng.',
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình lấy danh sách người dùng.',
    });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình lấy thông tin người dùng.',
    });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json({
      message: 'Thông tin người dùng đã được cập nhật thành công.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình cập nhật thông tin người dùng.',
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndRemove(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
    }
    res.json({ message: 'Người dùng đã được xóa thành công.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Đã xảy ra lỗi trong quá trình xóa người dùng.',
    });
  }
};
