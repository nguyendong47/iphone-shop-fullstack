exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId,
      );
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.status(200).json({
      status: 'success',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi khi thêm sản phẩm vào giỏ hàng.',
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate(
      'products.product',
    );

    res.status(200).json({
      status: 'success',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Lỗi khi lấy giỏ hàng.',
    });
  }
};
