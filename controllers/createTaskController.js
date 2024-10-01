const taskCollection = require('../models/createTaskModel')

exports.createTask = async (req, res) => {
    try {
        console.log('received data',req.body)
      const query = req.body;
      const result = await taskCollection.insertOne(query);
      res.send(result);
      console.log(result)
    } catch (error) {
      console.error("Error creating Task:", error);
      res.status(500).send({ message: "Failed to create Task" });
    }
  };
  
  exports.getTask = async (req, res) => {
    try {
      const result = await taskCollection.find().toArray();
      res.send(result);
    } catch (error) {
      console.error("Error fetching Task:", error);
      res.status(500).send({ message: "Failed to fetch Task" });
    }
}
