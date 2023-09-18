const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	emailVerificationToken: {
		type: String,
		required: false,
	},
	emailVerificationExpires: {
		type: Date,
		required: false,
	},
	emailVerified: {
		type: Boolean,
		default: false,
	},
});

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
