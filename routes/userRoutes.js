const express = require("express");
const {
  createUser,
  getUsers,
  login,
  updateUserProfileByEmail,
} = require("../controllers/userController");

const router = express.Router();

router.post("/create", createUser);
router.post("/login", login);
router.get("/get", getUsers);
router.patch("/users/updateProfileByEmail", updateUserProfileByEmail);
module.exports = router;
