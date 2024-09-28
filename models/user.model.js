const { client } = require("../config/db");
const { use } = require("../routes/userRoutes");
const membersCollection = client.db("flowMate").collection("members");

module.exports =usersCollection;
