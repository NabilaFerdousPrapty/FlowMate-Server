const express = require("express");


const { createTask, getTask, updateTask, deleteTask, specificTask, updateOneTask, getEmailTask } = require("../controllers/createTaskController");


const router = express.Router();



const upload = require("../middlewares/multer");
router.post("/", createTask);
router.get("/", getTask);
router.get("/:id", specificTask);
router.get("/:email", getEmailTask);

router.delete("/:id", deleteTask);
router.put("/:id", updateOneTask);
router.patch("/:id", updateTask);

module.exports = router;

// local:5000/createTask
// local:5000/getTask
