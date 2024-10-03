const { ObjectId } = require('mongodb');
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

exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Task not found" });
    }
    res.send({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting Task:", error);
    res.status(500).send({ message: "Failed to delete Task" });
  }
};


exports.updateTask = async (req, res) =>{
  try {
    const items = req.body;
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        taskTitle: items.taskTitle,
        stage: items.stage,
        priority: items.priority,
        assignedTo: items.assignedTo,
      },
    };
    const result = await taskCollection.updateOne(filter, updatedDoc);
    res.send(result);
  }catch (error) {
    console.error("Error updating Task:", error);
    res.status(500).send({ message: "Failed to update Task" });
  }
}

exports.updateOneTask = async (req, res) =>{
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      stage: "done",
    },
  };
  const result = await taskCollection.updateOne(filter, updatedDoc);
  res.send(result);
}

exports.specificTask = async (req, res) =>{ 
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await taskCollection.findOne(query);
  res.send(result);
}



exports.deleteTask = async (req, res) =>{
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await taskCollection.deleteOne(query);
  res.send(result);
 }

