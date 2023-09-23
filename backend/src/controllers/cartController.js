const Cart = require('../models/Cart');

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

exports.updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found.',
      });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId,
    );
    if (productIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found in cart.',
      });
    }

    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid quantity.',
      });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      status: 'success',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating cart.',
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found.',
      });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId,
    );
    if (productIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found in cart.',
      });
    }

    // Remove product from cart
    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({
      status: 'success',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error removing product from cart.',
    });
  }
};
