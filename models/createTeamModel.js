const { db } = require("../utils/db");

const contactCollection = db.collection("create-team");

module.exports = contactCollection;
