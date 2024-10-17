const { ObjectId } = require("mongodb");
const taskCollection = require("../models/createTaskModel");

exports.createTask = async (req, res) => {
  try {
    console.log("Received data", req.body);
    const {
      taskTitle,
      assignedTo,
      stage,
      priority,
      workerMail,
      startDate,
      email,
      userName,
      boardName,
      teamName,
    } = req.body;

    const newTask = {
      taskTitle,
      assignedTo,
      stage,
      priority,
      workerMail,
      startDate: new Date(startDate),
      email,
      userName,
      boardName,
      teamName,
      filePath: req.file ? req.file.path : null, // Save file path if uploaded
    };

    const result = await taskCollection.insertOne(newTask);
    res.send(result);
    console.log("Task created:", result);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send({ message: "Failed to create Task" });
  }
};

// exports.createTask = async (req, res) => {
//   try {
//     console.log("received data", req.body);
//     const query = req.body;
//     const result = await taskCollection.insertOne(query);
//     res.send(result);
//     console.log(result);
//   } catch (error) {
//     console.error("Error creating Task:", error);
//     res.status(500).send({ message: "Failed to create Task" });
//   }
// };

exports.getTask = async (req, res) => {
  const { sort, search } = req.query; // Get sorting order and search query

  try {
    // Determine sort order: -1 for descending (newest first), 1 for ascending (oldest first)
    const sortOrder = sort === "newest" ? -1 : 1;

    // Construct query object for search
    const query = search
      ? { taskTitle: { $regex: search, $options: "i" } } // Case-insensitive search
      : {};

    // Fetch and sort the tasks from the database
    const result = await taskCollection
      .find(query)
      .sort({ startDate: sortOrder })
      .toArray();

    // Send the result back to the client
    res.send(result);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send({ message: "Failed to fetch tasks" });
  }
};

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

exports.updateTask = async (req, res) => {
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
  } catch (error) {
    console.error("Error updating Task:", error);
    res.status(500).send({ message: "Failed to update Task" });
  }
};

exports.updateOneTask = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updatedDoc = {
    $set: {
      stage: "done",
    },
  };
  const result = await taskCollection.updateOne(filter, updatedDoc);
  res.send(result);
};

exports.specificTask = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await taskCollection.findOne(query);
  res.send(result);
};

exports.deleteTask = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await taskCollection.deleteOne(query);
  res.send(result);
};

exports.getEmailTask = async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await taskCollection.findOne(query);
  res.send(user);
};
