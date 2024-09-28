const stripe = require("stripe")(process.env.Payment_Api_Key);

module.exports = stripe;
