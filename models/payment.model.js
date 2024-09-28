const { client } = require("../config/db");
const paymentsCollection = client.db("flowMate").collection("payments");

module.exports = paymentsCollection;
