const { db } = require("../utils/db");

const contactCollection = db.collection("contacts");

module.exports = contactCollection;
