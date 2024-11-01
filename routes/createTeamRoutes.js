const express = require("express");
const {
  createTeam,
  getTeamByEmail,
} = require("../controllers/createTeamController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const router = express.Router();
router.post("/", authMiddleware, createTeam);
router.get("/", authMiddleware, getTeamByEmail);

module.exports = router;
