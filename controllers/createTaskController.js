const { ObjectId } = require("mongodb");
const taskCollection = require("../models/createTaskModel");
const { v2: cloudinary } = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Api_Key,
  api_secret: process.env.Api_Secret,
});
exports.createTask = async (req, res) => {
  try {
    // console.log("Received data", req.body);
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

    };

    const result = await taskCollection.insertOne(newTask);
    res.send(result);
    // console.log("Task created:", result);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send({ message: "Failed to create Task" });
  }
};

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

exports.updateTaskFile = async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    console.log("Task ID:", id);

    // Check if an array of file URLs has been provided
    if (!req.body.files || req.body.files.length === 0) {
      return res.status(400).send({ message: "No file URLs provided" });
    }

    // Store the file URLs in an array
    const fileUrls = req.body.files; // Array of file URLs from the frontend

    // Use $push with $each to append the new files to the existing filePaths array
    const updatedDoc = {
      $set: {
        stage: "done",
      },
      $push: {
        filePaths: { $each: fileUrls },
      },
    };

    const result = await taskCollection.updateOne(filter, updatedDoc);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Task not found" });
    }

    if (result.modifiedCount === 0) {
      return res.status(404).send({ message: "No changes made" });
    }

    return res.status(200).send({
      message: "Task updated successfully",
      data: updatedDoc,
    });
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
}

exports.specificTask = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await taskCollection.findOne(query);
  res.send(result);
}

exports.specificTask = async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await taskCollection.findOne(query);
  res.send(result);
};

exports.getEmailTask = async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await taskCollection.findOne(query);
  res.send(user);
};
exports.getTaskByTeam = async (req, res) => {
  const { teamName } = req.params;
  const { sort, search } = req.query; // Get sorting order and search query

  try {
    // Determine sort order: -1 for descending (newest first), 1 for ascending (oldest first)
    const sortOrder = sort === "newest" ? -1 : 1;

    // Construct query object for search
    const query = {
      teamName: teamName,
      ...(search ? { taskTitle: { $regex: search, $options: "i" } } : {}), // Case-insensitive search
    };

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
exports.getTaskStatusCounts = async (req, res) => {
  try {

    const todoCount = await taskCollection.countDocuments({ stage: "todo" });
    const inProgressCount = await taskCollection.countDocuments({ stage: "in progress" });
    const doneCount = await taskCollection.countDocuments({ stage: "done" });

    // Construct the response object
    const statusCounts = {
      todo: todoCount,
      inProgress: inProgressCount,
      done: doneCount,
    };

    // Send the response with the counts for each stage
    res.send(statusCounts);
  } catch (error) {
    console.error("Error fetching task status counts:", error);
    res.status(500).send({ message: "Failed to fetch task status counts" });
  }
};
exports.getTaskCountByEmailAndStatus = async (req, res) => {
  try {
    const email = req.params.email;

    // Check if email is provided
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    // Get total task count assigned to the user by email
    const totalTaskCount = await taskCollection.countDocuments({ email: email });

    // Get the count of tasks in different stages (todo, in progress, done) for this user
    const todoCount = await taskCollection.countDocuments({ email: email, stage: "todo" });
    const inProgressCount = await taskCollection.countDocuments({ email: email, stage: "in progress" });
    const doneCount = await taskCollection.countDocuments({ email: email, stage: "done" });

    // Construct the response object with total count and counts for each stage
    const taskStatusCounts = {
      totalTasks: totalTaskCount,
      todo: todoCount,
      inProgress: inProgressCount,
      done: doneCount,
    };

    // Send the response
    res.send(taskStatusCounts);
  } catch (error) {
    console.error("Error fetching task counts by email and status:", error);
    res.status(500).send({ message: "Failed to fetch task counts" });
  }
};

exports.getTasksByStage = async (req, res) => {
  const teamName = req.params.teamName;
  const stage = req.params.stage; // Get stage from params
  // console.log("teamName", teamName);
  // console.log("stage", stage);

  const query = {
    teamName: teamName,
    stage: stage,
  };

  try {
    const tasks = await taskCollection.find(query).toArray(); // Ensure you convert cursor to array
    res.send(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error); // Log error for debugging
    res.status(500).send({ message: "Error fetching tasks" }); // Avoid sending error object directly
  }
};
exports.updateTaskStage = async (req, res) => {
  try {
    const { id, newStage } = req.body; // Expecting ID and new stage in the request body
    const filter = { _id: new ObjectId(id) };

    // Update the task's stage
    const updatedDoc = {
      $set: {
        stage: newStage,
      },
    };

    const result = await taskCollection.updateOne(filter, updatedDoc);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Task not found" });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).send({ message: "No changes made" });
    }

    return res.status(200).send({
      message: "Task stage updated successfully",
    });
  } catch (error) {
    console.error("Error updating task stage:", error);
    res.status(500).send({ message: "Failed to update task stage" });
  }
};