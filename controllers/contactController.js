const contactCollection = require("../models/contactModel");

exports.createContact = async (req, res) => {
  try {
    const query = req.body;
    const result = await contactCollection.insertOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).send({ message: "Failed to create contact" });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const result = await contactCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).send({ message: "Failed to fetch contacts" });
  }
};
