const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res, next) => {
    try {
        const amount = 999 * 100; // ₹999 in paise
        const options = {
            amount,
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        // Store order ID in user record optionally (or just return it)
        await User.findByIdAndUpdate(req.user._id, { razorpayOrderId: order.id });

        res.status(201).json({
            success: true,
            data: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
        });
    } catch (err) {
        console.error('Razorpay Order Error:', err);
        res.status(500).json({ success: false, message: 'Failed to create payment order' });
    }
};

/**
 * Verify Payment Signature
 */
exports.verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Update User to Pro
            const planExpiresAt = new Date();
            planExpiresAt.setDate(planExpiresAt.getDate() + 30); // 30 days validity

            await User.findByIdAndUpdate(req.user._id, {
                planType: 'pro',
                planExpiresAt,
                razorpayPaymentId: razorpay_payment_id,
            });

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully. You are now a Pro member!',
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (err) {
        console.error('Payment Verification Error:', err);
        res.status(500).json({ success: false, message: 'Internal server error during verification' });
    }
};
