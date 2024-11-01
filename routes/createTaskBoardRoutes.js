const express = require("express");
const {
  createBoard,
  getBoard,
  specificBoard,
  getEmailBoard,
} = require("../controllers/boardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createBoard);
router.get("/", authMiddleware, getBoard);
router.get("/:id", authMiddleware, specificBoard);
router.get("/:email", authMiddleware, getEmailBoard);

module.exports = router;

// local:5000/createBoard
// local:5000/getBoard
