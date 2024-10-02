const express = require("express");
const {createTeam,getTeamByEmail} = require("../controllers/createTeamController.js")
const router = express.Router();
router.post("/", createTeam);
router.get("/", getTeamByEmail);

module.exports = router;
