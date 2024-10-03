const express = require("express");
const {
  createUser,
  getUsers,
  login,
} = require("../controllers/userController");

const router = express.Router();

router.post("/create", createUser);
router.post("/login", login);
router.get("/get", getUsers);

module.exports = router;
