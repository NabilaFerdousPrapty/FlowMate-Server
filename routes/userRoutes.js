const express = require("express");
const {
  createUser,
  getUsers,
  login,
  updateUserProfileByEmail,
  updateFileCountByEmail,
  getFileCountByEmail,
  toggleUserBlockStatus,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", createUser);
router.post("/login", login);

router.get("/get", getUsers);
router.get("/team/:teamName", getUsersByTeam);
router.patch("/toggleBlockUser/:email", toggleUserBlockStatus);
router.patch("/updateProfileByEmail", updateUserProfileByEmail);
router.put("/update-file-count/:email", updateFileCountByEmail);
router.get("/file-count/:email", getFileCountByEmail);

module.exports = router;
// Hello there
