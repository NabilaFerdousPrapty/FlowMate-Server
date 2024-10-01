const { db } = require("../utils/db");

const taskCollection = db.collection("createTask");

module.exports = taskCollection;

