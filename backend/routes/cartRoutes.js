const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.authenticate);

router.post('/add-to-cart', cartController.addToCart);
router.get('/get-cart', cartController.getCart);

module.exports = router;
