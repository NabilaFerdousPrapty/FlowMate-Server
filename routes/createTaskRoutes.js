const express = require("express");
const { createTask, getTask } = require("../controllers/createTaskController");

const router = express.Router();

router.post("/",createTask );
router.get("/", getTask);

module.exports = router;

// local:5000/createTask
// local:5000/getTask
