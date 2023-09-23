const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.authenticate);

router.post('/add-to-cart', cartController.addToCart);
router.get('/get-cart', cartController.getCart);
router.put('/update-cart', cartController.updateCart);
router.delete('/remove-from-cart', cartController.removeFromCart);

module.exports = router;
