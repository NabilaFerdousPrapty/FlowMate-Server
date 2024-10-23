const express = require("express");
const {
  createUser,
  getUsers,
  login,
  updateUserProfileByEmail,
  updateFileCountByEmail,
  getFileCountByEmail,
} = require("../controllers/userController");

const router = express.Router();

router.post("/create", createUser);
router.post("/login", login);
router.get("/get", getUsers);
router.patch("/updateProfileByEmail", updateUserProfileByEmail);
router.put('/update-file-count/:email', updateFileCountByEmail);
router.get('/file-count/:email', getFileCountByEmail);
module.exports = router;
