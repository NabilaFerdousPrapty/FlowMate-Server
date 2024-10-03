// const mongoose = require("mongoose");
const { db } = require("../utils/db");

const usersCollection = db.collection("Users");

module.exports = usersCollection;

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       required: true,
//       default: "user",
//       enum: ["user", "admin", "superadmin"],
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Users", userSchema);
