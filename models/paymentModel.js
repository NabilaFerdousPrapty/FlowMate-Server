const { db } = require("../utils/db");

const paymentsCollection = db.collection("payments");

module.exports = paymentsCollection;
