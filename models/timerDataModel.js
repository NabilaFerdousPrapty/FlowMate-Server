const { db } = require("../utils/db");

const timerCollection = db.collection("timerData");

module.exports = timerCollection;

