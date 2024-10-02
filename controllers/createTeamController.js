const createTeamCollection = require("../models/createTeamModel.js");

exports.createTeam = async (req, res) => {
  try {
    const query = req.body;
    const result = await createTeamCollection.insertOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).send({ message: "Failed to create contact" });
  }
};

exports.getTeamByEmail = async (req, res) => {
  try {
    const email = req.query.email
    if(email) {
      const result = await createTeamCollection.find({email: email}).toArray()
      res.send(result)
    }
  } catch (error) {
    console.error("Error fetching getTeamByEmail:", error);
    res.status(500).send({ message: "Failed to fetch getTeamByEmail" });
  }
};
