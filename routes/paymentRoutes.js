const express = require("express");
const {
  createPaymentIntent,
  processPayment,
  getPayments,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/", processPayment);
router.get("/", getPayments);

module.exports = router;
