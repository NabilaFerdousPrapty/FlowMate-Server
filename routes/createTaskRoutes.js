const express = require("express");


const { createTask, getTask, updateTask, deleteTask, specificTask, updateOneTask, getEmailTask, updateTaskFile, getTaskByTeam, getTaskStatusCounts, getTaskCountByEmailAndStatus, getTaskStageByTeamName, getTasksByStage } = require("../controllers/createTaskController");


const router = express.Router();



const upload = require("../middlewares/multer");
router.post("/", createTask);
router.get("/", getTask);
router.get("/:id", specificTask);
router.get("/:email", getEmailTask);
router.get("/teamName/:teamName", getTaskByTeam);
router.get("/status", getTaskStatusCounts);
router.get('/task-count/:email', getTaskCountByEmailAndStatus);
router.get("/tasksByStage/:teamName/:stage", getTasksByStage);

router.delete("/:id", deleteTask);
router.put("/file/:id", upload.single('file'), updateTaskFile);
router.put("/:id", updateOneTask);
router.patch("/:id", updateTask);


module.exports = router;

// local:5000/createTask
// local:5000/getTask
