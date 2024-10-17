const express = require("express");
const { createTimer, getTimer, specificTimer, getEmailTimer } = require("../controllers/timerDataController");

const router = express.Router();

router.post("/",createTimer );
router.get("/", getTimer);
router.get("/:id", specificTimer);
router.get("/:email", getEmailTimer);

module.exports = router;

// local:5000/timerData