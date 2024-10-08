const { db } = require("../utils/db");

const boardCollection = db.collection("createBoard");

module.exports = boardCollection;

