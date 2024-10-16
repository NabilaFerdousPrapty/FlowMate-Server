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
    const result = await usersCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Failed to fetch users" });
  }
};


exports.updateUserProfileByEmail = async (req, res) => {
  try {
    const { email } = req.body; // Email comes from the frontend
    const { name, photo } = req.body; // Expecting name and photo URL from the frontend

    // Find the user by email and update the name and photo
    const updatedUser = await Users.findOneAndUpdate(
      { email: email }, // Find the user by email
      {
        name: name,
        photo: photo
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    // Respond with the updated user data
    res.status(200).send({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).send({ message: "Failed to update user profile" });
  }
};
