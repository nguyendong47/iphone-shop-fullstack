const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Route để tạo phiên thanh toán
app.post('/create-checkout-session', async (req, res) => {
	const { products } = req.body; // Thông tin sản phẩm (tên, giá, số lượng, vv.)

	// Tạo một phiên thanh toán
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: products.map((product) => ({
			price_data: {
				currency: 'usd',
				product_data: {
					name: product.name,
				},
				unit_amount: product.price * 100, // Giá sản phẩm (đơn vị tiền tệ, ví dụ: 10 USD sẽ là 1000)
			},
			quantity: product.quantity,
		})),
		mode: 'payment',
		success_url: 'URL_thanh_toan_thanh_cong',
		cancel_url: 'URL_huy_thanh_toan',
	});

	// Trả về ID phiên thanh toán cho phía Frontend
	res.json({ sessionId: session.id });
});

// Route để xử lý phản hồi từ Stripe
app.post('/webhook', async (req, res) => {
	const event = req.body;

	// Xử lý sự kiện từ Stripe (thanh toán thành công, hủy đơn hàng, vv.)
	switch (event.type) {
		case 'checkout.session.completed':
			const session = event.data.object;
			// Cập nhật cơ sở dữ liệu với thông tin đơn hàng (session)
			break;
		// Xử lý các sự kiện khác tùy theo yêu cầu của bạn
		default:
		// Xử lý các sự kiện khác (nếu cần)
	}

	res.status(200).json({ received: true });
});
