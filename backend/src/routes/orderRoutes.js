const express = require('express');
const {
  createOrder,
  getOrderById,
  getAllOrders,
  updatePaymentStatus,
  updateDeliveryStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/:id', getOrderById);

router.get('/all', getAllOrders); // Lấy tất cả đơn hàng
router.put('/:id/pay', updatePaymentStatus); // Cập nhật trạng thái thanh toán
router.put('/:id/deliver', updateDeliveryStatus); // Cập nhật trạng thái giao hàng

module.exports = router;
