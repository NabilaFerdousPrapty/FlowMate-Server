const stripe = require('stripe')(process.env.Payment_Api_Key); // Import and initialize Stripe
const { db } = require("../utils/db"); 
const paymentsCollection = db.collection("payments"); 

exports.createPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;
    const amount = parseInt(price * 100); // Convert price to cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });
    console.log("Payment Intent Created:", paymentIntent);
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error); // Add detailed logging
    res.status(500).send({ message: "Failed to create payment intent", error });
  }
};

exports.createPayment = async (req, res) => {
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
    console.error("Error fetching payment history:", error);
    res.status(500).send({ message: "Failed to fetch payment history" });
  }
};
