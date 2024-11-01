const express = require("express");
const {
  createTimer,
  getTimer,
  specificTimer,
  getEmailTimer,
} = require("../controllers/timerDataController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTimer);
router.get("/", authMiddleware, getTimer);
router.get("/:id", authMiddleware, specificTimer);
router.get("/:email", authMiddleware, getEmailTimer);

module.exports = router;

// local:5000/timerData
