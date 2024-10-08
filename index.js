const express = require("express");
const cors = require("cors");
const { connectDB, db } = require("./utils/db");
const memberRoutes = require("./routes/memberRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const createTaskRoutes = require('./routes/createTaskRoutes');
const { ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 7000;

require("dotenv").config();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:7000",
      "https://flowmate-letscollaborate.web.app",
      "https://flowmate-letscollaborate.firebaseapp.com",
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

const createTeamCollection = db.collection('create-team');
const usersCollection = db.collection("Users");
const feedbacksCollection = db.collection("feedbacks");
const newslettersCollection = db.collection("newsletters");

// Middleware for routes
app.use("/payments", paymentRoutes);
app.use("/team", memberRoutes);
app.use("/contacts", contactRoutes);
app.use("/users", userRoutes);
app.use("/createTask", createTaskRoutes);
//check if user is admin
app.get('/users/admin/:email', async (req, res) => {
  const email = req.params.email;

  const query = { email: email };
  const user = await usersCollection.findOne(query);
  let admin = false;
  if (user) {
    admin = user?.role === 'admin';
  }
  res.send({ admin });
})

// Create a new team
app.post('/create-team', async (req, res) => {
  try {
    const query = req.body;
    const result = await createTeamCollection.insertOne(query);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to create team", error });
  }
});

// Get the team list
app.get('/create-team', async (req, res) => {
  try {
    const email = req.query.email;
    if (email) {
      const result = await createTeamCollection.find({
        $or: [
          { email },
          { "members.email": email }
        ]
      }).toArray();
      res.send(result);
    } else {
      res.status(400).send({ message: "Email is required" });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to retrieve teams", error });
  }
});
//newsletter
app.post("/newsletter", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email already exists
    const existingSubscriber = await newslettersCollection.findOne({ email });
    if (existingSubscriber) {
      return res.send({ message: "You have already been subscribed to our newsletter" });
    }

    // Insert new subscriber
    const result = await newslettersCollection.insertOne({
      email,
      createdAt: new Date(),
    });

    res.send({ message: "Subscribed", result });
  } catch (error) {
    console.error("Error posting newsletter:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// app.get("/newsletters", async (req, res) => {
//   try {
//     const newsletters = await newslettersCollection.find().toArray();
//     res.send(newsletters);
//   } catch (error) {
//     console.error("Error fetching newsletters:", error);
//     res.status(500).send({ message: "Internal server error" });
//   }
// });


app.get("/newsletters", async (req, res) => {
  try {
    // Ensure newslettersCollection is defined
    if (!newslettersCollection) {
      throw new Error("newslettersCollection is not initialized");
    }

    const newsletters = await newslettersCollection.find().toArray();

    // If no newsletters found, return a suitable message
    if (newsletters.length === 0) {
      return res.status(404).send({ message: "No newsletters found" });
    }

    // Send the newsletters
    res.send(newsletters);
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});


// Delete a team by team admin
app.delete('/create-team/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await createTeamCollection.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Team not found" });
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to delete team", error });
  }
});

// Get team roles
app.get('/create-team/role/:role', async (req, res) => {
  try {
    const role = req.params.role;
    const email = req.query.email;
    if (role && email) {
      const result = await createTeamCollection.find({ email, role }).toArray();
      res.send(result);
    } else {
      res.status(400).send({ message: "Role and email are required" });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to retrieve roles", error });
  }
});

// Get team data by team name
app.get('/team/:teamName', async (req, res) => {
  try {
    const teamName = req.params.teamName;
    const result = await createTeamCollection.findOne({ teamName });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to retrieve team", error });
  }
});

// Search users for adding team members
app.get('/search', async (req, res) => {
  try {
    const name = req.query.name;
    if (name) {
      const result = await usersCollection.findOne({
        name: { $regex: new RegExp(name, 'i') }
      });
      res.send(result);
    } else {
      res.status(400).send({ message: "Name is required for search" });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to search users", error });
  }
});

// Add a new member to a specific team
app.post("/team/:id/add-member", async (req, res) => {
  const { id } = req.params;
  const { _id, teamId, displayName, email, role, photo, uid, status } = req.body;

  try {
    const team = await createTeamCollection.findOne({ _id: new ObjectId(id) });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    const isExiting = await team.members?.some(member => member.email === email)
    if (isExiting) {
      return res.status(400).json({ message: "Member with this email already exists in the team" });
    }
    const newMember = { _id, teamId, displayName, email, role, photo, uid, status };
    team.members = team.members || [];
    team.members.push(newMember);
    const result = await createTeamCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { members: team.members } }
    );

    res.status(200).json({ message: "Member added successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Failed to add member", error });
  }
});

// Get team members by email
app.get('/members', async (req, res) => {
  try {
    const teamName = req.query.teamName;
    if (teamName) {
      const result = await createTeamCollection.find({ teamName }).toArray();
      res.send(result);
    } else {
      res.status(400).send({ message: "Team Name is required" });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to retrieve members", error });
  }
});
// delete members from team
app.delete('/members/:teamId/:memberId', async (req, res) => {
  const { teamId, memberId } = req.params;

  try {
    const query = { _id: new ObjectId(teamId) };

    // Remove the member from the team by _id
    const result = await createTeamCollection.updateOne(
      query,
      {
        $pull: {
          members: { _id: memberId }
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Member not found or team does not exist" });
    }

    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete member", error });
  }
});

// Get all teams members
app.get('/teams', async (req, res) => {
  try {
    const result = await createTeamCollection.find().toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to retrieve teams", error });
  }
});
// Feedback routes
app.post("/feedback", async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const userEmail = req.query.email;

    if (userEmail) {
      // Find user by email
      const user = await usersCollection.findOne({ email: userEmail });

      if (user) {
        const result = await feedbacksCollection.insertOne({
          userId: user._id,
          name: user.name,
          image: user.photo,
          rating: rating,
          feedback: feedback,
          createdAt: new Date(),
        });
        res.send(result);
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } else {
      res.status(400).send({ message: "User email is required" });
    }
  } catch (error) {
    console.error("Error posting feedback:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/feedbacks", async (req, res) => {
  try {
    const feedbacks = await feedbacksCollection.find().toArray();
    res.send(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Connect to database and start server
connectDB();
app.get("/", (req, res) => {
  res.send("FlowMate is here to help you collaborate with your team!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
