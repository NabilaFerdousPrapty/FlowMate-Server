const usersCollection = require("../models/userModel");

exports.createUser = async (req, res) => {
  try {
    const query = req.body;
    const email = query?.email;
    const isExiting = await usersCollection.findOne({ email });

    if (isExiting) {
      return res.status(400).send({ message: "User already exists" });
    }

    const result = await usersCollection.insertOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Failed to create user" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await usersCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Failed to fetch users" });
  }
};
