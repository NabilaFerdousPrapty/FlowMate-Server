const membersCollection = require("../models/memberModel");
const { ObjectId } = require("mongodb");

exports.createMember = async (req, res) => {
  try {
    const query = req.body;
    const email = query?.email;
    const isExisting = await membersCollection.findOne({ email });

    if (isExisting) {
      return res.status(400).send({ message: "Member already exists" });
    }

    const result = await membersCollection.insertOne(query);
    res.send(result);
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).send({ message: "Failed to create member" });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const result = await membersCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).send({ message: "Failed to fetch members" });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await membersCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Member not found" });
    }
    res.send({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).send({ message: "Failed to delete member" });
  }
};
