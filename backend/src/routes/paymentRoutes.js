const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentControllers');
const authMiddleware = require('../middleware/authMiddleware');

// All payment routes are protected
router.use(authMiddleware);

router.post('/create-order', paymentController.createOrder);
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;
