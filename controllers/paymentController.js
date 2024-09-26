import Payment from "../models/payment.model.js";

export const createPayment = async (req, res) => {
  try {
    const { user, paymentMethod, amount, plan } = req.body;

    const payment = await Payment.create({
      user,
      paymentMethod,
      amount,
      plan,
    });

    res.status(201).json(payment);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
