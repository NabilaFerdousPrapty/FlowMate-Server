const express = require("express");

const {
  createTask,
  getTask,
  updateTask,
  deleteTask,
  specificTask,
  updateOneTask,
  getEmailTask,
  updateTaskFile,
  getTaskByTeam,
  getTaskStatusCounts,
  getTaskCountByEmailAndStatus,
  getTaskStageByTeamName,
  getTasksByStage,
  updateTaskStage,
  deleteTaskFile,
} = require("../controllers/createTaskController");

const router = express.Router();
const upload = require("../middlewares/multer");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTask);
router.get("/:id", authMiddleware, specificTask);
router.get("/:email", authMiddleware, getEmailTask);
router.get("/teamName/:teamName", authMiddleware, getTaskByTeam);
router.get("/status", authMiddleware, getTaskStatusCounts);
router.get("/task-count/:email", authMiddleware, getTaskCountByEmailAndStatus);
router.get("/tasksByStage/:teamName/:stage", authMiddleware, getTasksByStage);

router.delete("/:id", authMiddleware, deleteTask);
router.put("/file/:id", authMiddleware, updateTaskFile);
router.delete("/file/:id", authMiddleware, deleteTaskFile);

router.put("/:id", authMiddleware, updateOneTask);
router.patch("/:id", authMiddleware, updateTask);
router.put("/updateStage/:taskId", authMiddleware, updateTaskStage);

module.exports = router;

// local:5000/createTask
// local:5000/getTask
