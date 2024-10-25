const { ObjectId } = require('mongodb');
const timerCollection = require('../models/timerDataModel');

exports.createTimer = async (req, res) => {
  try {
    // console.log('received data',req.body)
    const query = req.body;
    const result = await timerCollection.insertOne(query);
    res.send(result);
    // console.log(result)
  } catch (error) {
    console.error("Error creating Timer:", error);
    res.status(500).send({ message: "Failed to create Timer" });
  }
};


exports.getTimer = async (req, res) => {
  try {
    const result = await timerCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching Timer:", error);
    res.status(500).send({ message: "Failed to fetch Timer" });
  }
};


exports.specificTimer = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await timerCollection.findOne(query);
  res.send(result);
}



exports.getEmailTimer = async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await timerCollection.findOne(query);
  res.send(user);
};
