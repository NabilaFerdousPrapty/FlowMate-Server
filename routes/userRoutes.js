const express = require("express");
const {
  createUser,
  getUsers,
  login,
  updateUserProfileByEmail,
  updateFileCountByEmail,
  getFileCountByEmail,
  toggleUserBlockStatus,
  getUsersByTeam,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", createUser);
router.post("/login", login);

router.get("/get", authMiddleware, getUsers);
router.get("/team/:teamName", authMiddleware, getUsersByTeam);
router.patch("/toggleBlockUser/:email", authMiddleware, toggleUserBlockStatus);
router.patch("/updateProfileByEmail", authMiddleware, updateUserProfileByEmail);
router.put("/update-file-count/:email", authMiddleware, updateFileCountByEmail);
router.get("/file-count/:email", authMiddleware, getFileCountByEmail);

module.exports = router;
