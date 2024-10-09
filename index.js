const express = require("express");
const cors = require("cors");
const { connectDB, db } = require("./utils/db");
const memberRoutes = require("./routes/memberRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const createTaskRoutes = require('./routes/createTaskRoutes');
const createTaskBoardRoutes = require('./routes/createTaskBoardRoutes');
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
      "http://localhost:7000",
      "http://localhost:5000",
      "https://flowmate-letscollaborate.web.app",
      "https://flowmate-letscollaborate.firebaseapp.com",
    ],
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

const createTeamCollection = db.collection('teams');
const usersCollection = db.collection("Users");
const feedbacksCollection = db.collection("feedbacks");
const newslettersCollection = db.collection("newsletters");
const  boardCollection = db.collection("createBoard");

// Middleware for routes
app.use("/payments", paymentRoutes);
app.use("/team", memberRoutes);
app.use("/contacts", contactRoutes);
app.use("/users", userRoutes);
app.use("/createTask", createTaskRoutes);
app.use("/createBoard", createTaskBoardRoutes);
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

// get users by email 

app.get('/users', async (req, res) => {
  const email = req.query.email;
  if(email) {
    const result = await usersCollection.findOne({ email: email });
    res.send(result);
  } else {
    const result = await usersCollection.find().toArray()
    res.send(result);
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
// pending members add on the pendingMembers
app.patch('/teams/:teamId/add-pending-member', async (req, res) => {
  const { teamId } = req.params;
  const { userId } = req.body; 

  try {
    // Find the team by its ID
    const team = await createTeamCollection.findOne({ _id: new ObjectId(teamId) });

    // If the team is not found, return a 404 error
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if the userId is already in the pendingMembers array
    if (team.pendingMembers.includes(userId)) {
      return res.status(400).json({ message: 'User is already in pending members' });
    }

    // Add the userId to the pendingMembers array
    const update = await createTeamCollection.updateOne(
      { _id: new ObjectId(teamId) },
      { $addToSet: { pendingMembers: userId } }
    );

    if (update.matchedCount === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({
      message: 'Member added to pendingMembers successfully',
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to add member to pendingMembers',
      error: error.message,
    });
  }
});

// remove the member from pendingMembers and add the id on the teamMembers
// Accept a pending member
app.patch('/create-team/:teamId/accept-member', async (req, res) => {
  const { teamId } = req.params;
  const { userId } = req.body; 

  try {
    // Find the team by its ID
    const team = await createTeamCollection.findOne({ _id: new ObjectId(teamId) });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (!team.pendingMembers.includes(userId)) {
      return res.status(400).json({ message: 'User is not in pending members' });
    }

    // Update the team: Remove user from pendingMembers and add to teamMembers
    await createTeamCollection.updateOne(
      { _id: new ObjectId(teamId) },
      {
        $pull: { pendingMembers: userId },
        $addToSet: { teamMembers: userId } 
      }
    );

    res.status(200).json({ message: 'Member accepted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept member', error: error.message });
  }
});



// Get the team list
app.get('/create-team', async (req, res) => {
  try {
    const email = req.query.email;

    if (email) {
      const result = await createTeamCollection.find({ email }).toArray(); // Ensure find() results are converted to an array
      res.send(result);
    } else {
      res.status(400).send({ message: "Email is required" });
    }
  } catch (error) {
    res.status(500).send({ message: "Failed to retrieve teams", error: error.message });
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
