const { db } = require("../utils/db");

const membersCollection = db.collection("members");

module.exports = membersCollection;
