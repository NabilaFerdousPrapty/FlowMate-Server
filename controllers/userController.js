const usersCollection = require("../models/userModel");

const Users = require("../models/userModel");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, status, photo, teamName } = req.body;
    // console.log(req.body);

    const isExiting = await usersCollection.findOne({ email });

    if (isExiting) {
      return res.send({ message: "User already exists" });
    }

    const hasedPassword = await bycrypt.hash(password, 10);

    const result = await usersCollection.insertOne({
      name,
      email,
      password: hasedPassword,
      role,
      status,
      photo,
      teamName
    });

    res.send(result);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Failed to create user" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    const isMatch = await bycrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).send({ message: "Login successful", token });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Failed to fetch users" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const filter = { status: 'active' }
    const result = await usersCollection.find(filter).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Failed to fetch users" });
  }
};
//block a user
exports.toggleUserBlockStatus = async (req, res) => {
  try {
    const { email } = req.params;
    const { status } = req.body; // Expect "blocked" or "active" in the request body

    if (!email) {
      return res.status(400).send({ message: "User email is required" });
    }
    if (!status || (status !== 'blocked' && status !== 'active')) {
      return res.status(400).send({ message: "Valid status ('blocked' or 'active') is required" });
    }

    const updatedUser = await Users.findOneAndUpdate(
      { email },
      { $set: { status } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: `User ${status} successfully`, user: updatedUser });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).send({ message: "Failed to update user status" });
  }
};


exports.updateUserProfileByEmail = async (req, res) => {
  try {
    const { email, name, photo } = req.body;

    if (!email || !name || !photo) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    // Use $set operator to update only the specific fields
    const updatedUser = await Users.findOneAndUpdate(
      { email: email }, // Find the user by email
      { $set: { name: name, photo: photo } }, // Use $set to update name and photo
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send({ message: "Failed to update user profile" });
  }
};

exports.updateFileCountByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    // Check if email is provided
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    // Find the user by email and increment fileCount by 1
    const updatedUser = await Users.findOneAndUpdate(
      { email: email },
      { $inc: { fileCount: 1 } }, // Increment fileCount by 1
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "File count updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating file count:", error);
    res.status(500).send({ message: "Failed to update file count" });
  }
};
exports.getFileCountByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    // console.log(email);

    // Check if email is provided
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }


    const user = await usersCollection.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }


    const fileCount = user.fileCount || 0;

    res.status(200).send({ message: "File count fetched successfully", fileCount });
  } catch (error) {
    console.error("Error fetching file count:", error);
    res.status(500).send({ message: "Failed to fetch file count" });
  }
};
