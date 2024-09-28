const { db } = require("../utils/db");

const usersCollection = db.collection("Users");

module.exports = usersCollection;
