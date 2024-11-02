const express = require("express");
const {
  createBoard,
  getBoard,
  specificBoard,
  getEmailBoard,
} = require("../controllers/boardController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", createBoard);
router.get("/", getBoard);
router.get("/:id", specificBoard);
router.get("/:email", getEmailBoard);

module.exports = router;

// local:5000/createBoard
// local:5000/getBoard
