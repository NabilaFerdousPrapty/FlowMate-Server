const express = require("express");
const {
  createPaymentIntent,
  createPayment,
  getPayments,
} = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create payment intent
router.post("/create-payment-intent", authMiddleware, createPaymentIntent);

// Process payment
router.post("/payment", authMiddleware, createPayment);

// Get payment history
router.get("/payment", authMiddleware, getPayments);

module.exports = router;
