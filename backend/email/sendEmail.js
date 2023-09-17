const nodemailer = require('nodemailer');

// Tạo một transporter để gửi email
const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'your_email@gmail.com',
		pass: 'your_email_password',
	},
});

// Xây dựng nội dung email
const emailContent = {
	from: 'your_email@gmail.com',
	to: 'user_email@example.com',
	subject: 'Xác thực email',
	text: `Nhấp vào liên kết sau để xác thực email: http://yourwebsite.com/verify/${emailToken}`,
};

// Gửi email
transporter.sendMail(emailContent, (err, info) => {
	if (err) {
		console.error(err);
	} else {
		console.log('Email sent: ' + info.response);
	}
});
