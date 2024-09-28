const express = require("express");
const {
  createPaymentIntent, 
  createPayment,
  getPayments,
} = require("../controllers/paymentController");

const router = express.Router();

// Create payment intent
router.post("/create-payment-intent", createPaymentIntent);

// Process payment
router.post("/payment", createPayment);

// Get payment history
router.get("/payment", getPayments);

module.exports = router;
