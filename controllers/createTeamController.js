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

exports.getTeam = async (req, res) => {
  try {
    const result = await createTeamCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).send({ message: "Failed to fetch contacts" });
  }
};
