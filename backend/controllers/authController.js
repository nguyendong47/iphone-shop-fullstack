const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../email/sendEmail');

exports.register = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ error: 'Email already exists' });
		}

		const user = new User({
			name,
			email,
			password,
		});

		await user.save();

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '30d',
		});

		res.json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ error: 'Invalid email or password' });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ error: 'Invalid email or password' });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: '30d',
		});

		res.json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
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
	const { email } = req.body;

	try {
		// Tìm người dùng theo địa chỉ email
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				message: 'Không tìm thấy người dùng với địa chỉ email này.',
			});
		}

		// Tạo mã xác thực đặt lại mật khẩu
		const resetToken = crypto.randomBytes(64).toString('hex');
		const resetTokenExpires = Date.now() + 3600000; // Hết hạn sau 1 giờ

		// Lưu mã xác thực vào cơ sở dữ liệu
		user.resetPasswordToken = resetToken;
		user.resetPasswordTokenExpires = resetTokenExpires;
		await user.save();

		// Gửi email chứa liên kết đặt lại mật khẩu
		const resetLink = `http://yourwebsite.com/reset-password/${resetToken}`;
		const emailContent = {
			from: 'your_email@gmail.com',
			to: email,
			subject: 'Đặt Lại Mật Khẩu',
			text: `Nhấp vào liên kết sau để đặt lại mật khẩu: ${resetLink}`,
		};

		await sendEmail(emailContent); // Sử dụng hàm sendEmail để gửi email

		res.json({
			message: 'Một email đã được gửi với hướng dẫn đặt lại mật khẩu.',
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu.',
		});
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
				message:
					'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
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
			return res
				.status(404)
				.json({ message: 'Không tìm thấy người dùng.' });
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
			{ new: true }
		);
		if (!user) {
			return res
				.status(404)
				.json({ message: 'Không tìm thấy người dùng.' });
		}
		res.json({
			message: 'Thông tin người dùng đã được cập nhật thành công.',
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message:
				'Đã xảy ra lỗi trong quá trình cập nhật thông tin người dùng.',
		});
	}
};

exports.deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findByIdAndRemove(id);
		if (!user) {
			return res
				.status(404)
				.json({ message: 'Không tìm thấy người dùng.' });
		}
		res.json({ message: 'Người dùng đã được xóa thành công.' });
	} catch (err) {
		console.error(err);
		res.status(500).json({
			message: 'Đã xảy ra lỗi trong quá trình xóa người dùng.',
		});
	}
};
