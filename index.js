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
const port = process.env.PORT || 5000;

require("dotenv").config();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://flowmate-letscollaborate.web.app",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

const createTeamCollection = db.collection('create-team');
const usersCollection = db.collection("Users");
const feedbacksCollection = db.collection("feedbacks");

// Middleware for routes
app.use("/payments", paymentRoutes);
app.use("/team", memberRoutes);
app.use("/contacts", contactRoutes);
app.use("/users", userRoutes);
app.use("/createTask", createTaskRoutes);

// get the users by email address

app.get('/users', async (req, res) => {
  const email = req.query.email
  if(email) {
    const result = await usersCollection.find({email: email}).toArray()
    res.send(result)
  }
})
// update the users role
app.patch('/users', async (req, res) => {
  const email = req.query.email
  const {role} = req.body
  if(email && role) {
    const update = {
      $set: {
        role: role,
      }
    }
    const result = await usersCollection.updateOne({email: email}, update)
    res.send(result)
  }
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
    const isExisting = team.members?.some((member) => member.email === email);
    if (isExisting) {
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

// Delete members from team
app.delete('/members/:teamId/:memberId', async (req, res) => {
  const { teamId, memberId } = req.params;

  try {
    const query = { _id: new ObjectId(teamId) };

    // Remove the member from the team by _id
    const result = await createTeamCollection.updateOne(
      query,
      { $pull: { members: { _id: memberId } } }
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
// edit the team description

app.put('/teams/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const { teamName, teamDescription } = req.body;

  if (teamName && teamDescription) {
    try {
      const update = {
        $set: {
          teamName: teamName,
          teamDescription: teamDescription,
        },
      };
      
      const result = await createTeamCollection.updateOne(query, update);

      if (result.modifiedCount > 0) {
        res.status(200).json({ message: 'Team updated successfully' });
      } else {
        res.status(404).json({ message: 'Team not found or no changes made' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating team', error });
    }
  } else {
    res.status(400).json({ message: 'teamName and teamDescription are required' });
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

// Get the team request from the server
app.get('/team-requests', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "User email is required" });
  }

  try {
    const teamRequests = await createTeamCollection.find({
      "members.email": email,
      "members.status": "pending"
    }).toArray();

    res.status(200).json(teamRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team requests', error });
  }
});
// post the team requests
app.post('/team-requests/accept', async (req, res) => {
  const { teamId, userEmail } = req.body;

  if (!teamId || !userEmail) {
    return res.status(400).json({ message: "Team ID and user email are required" });
  }

  try {
    const result = await createTeamCollection.updateOne(
      { _id: new ObjectId(teamId), "members.email": userEmail, "members.status": "pending" },
      { $set: { "members.$.status": "accepted" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Team request not found or already processed" });
    }

    res.status(200).json({ message: "Team request accepted" });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting team request', error });
  }
});
connectDB(); 
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
});

