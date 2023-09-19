const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('products.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    let query = Order.find().populate('user').populate('products.product');

    // Lọc theo trạng thái thanh toán
    if (req.query.isPaid) {
      query = query.where('isPaid').equals(req.query.isPaid === 'true');
    }

    // Lọc theo trạng thái giao hàng
    if (req.query.isDelivered) {
      query = query
        .where('isDelivered')
        .equals(req.query.isDelivered === 'true');
    }

    // Sắp xếp
    if (req.query.sortBy) {
      const order = req.query.order === 'desc' ? -1 : 1;
      query = query.sort({ [req.query.sortBy]: order });
    }

    const orders = await query;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders', error });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment status', error });
  }
};

exports.updateDeliveryStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery status', error });
  }
};
