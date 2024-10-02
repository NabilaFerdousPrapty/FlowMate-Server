const { db } = require("../utils/db");

const createTeamCollection = db.collection("create-team");

module.exports = createTeamCollection;
