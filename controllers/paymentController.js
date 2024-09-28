const paymentsCollection = require("../models/paymentModel");
const stripe = require("stripe")(process.env.Payment_Api_Key);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;
    const amount = parseInt(price * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      payment_method_types: ["card"],
      currency: "usd",
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).send({ message: "Failed to create payment intent" });
  }
};

exports.processPayment = async (req, res) => {
  try {
    const payment = req.body;
    const result = await paymentsCollection.insertOne(payment);
    res.send(result);
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send({ message: "Failed to process payment" });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const result = await paymentsCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).send({ message: "Failed to fetch payments" });
  }
};
