const express = require("express");
const { createMember, getMembers, deleteMember } = require("../controllers/memberController");

const router = express.Router();

// Create a new member
router.post("/create-member", createMember);

// Get all members
router.get("/members", getMembers);

// Delete a member
router.delete("/member/:id", deleteMember);

module.exports = router;
