const express = require("express");
const {
  createMember,
  getMembers,
  deleteMember,
} = require("../controllers/memberController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new member
router.post("/create-member", authMiddleware, createMember);

// Get all members
router.get("/members", authMiddleware, getMembers);

// Delete a member
router.delete("/member/:id", authMiddleware, deleteMember);

module.exports = router;
