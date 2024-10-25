const { ObjectId } = require('mongodb');
const boardCollection = require('../models/createBoardModel');

exports.createBoard = async (req, res) => {
  try {
    // console.log('received data', req.body)
    const query = req.body;
    const result = await boardCollection.insertOne(query);
    res.send(result);
    // console.log(result)
  } catch (error) {
    console.error("Error creating Board:", error);
    res.status(500).send({ message: "Failed to create Board" });
  }
};


exports.getBoard = async (req, res) => {
  try {
    const result = await boardCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching board:", error);
    res.status(500).send({ message: "Failed to fetch board" });
  }
};



exports.specificBoard = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await boardCollection.findOne(query);
  res.send(result);
}



exports.getEmailBoard = async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await boardCollection.findOne(query);
  res.send(user);
};

