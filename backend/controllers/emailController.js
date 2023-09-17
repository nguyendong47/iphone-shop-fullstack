const crypto = require('crypto');

// Tạo mã xác thực ngẫu nhiên
const emailToken = crypto.randomBytes(64).toString('hex');
