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
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
  })
);

app.use("/payments", paymentRoutes);
app.use("/team", memberRoutes);
app.use("/contacts", contactRoutes);
app.use("/users", userRoutes);
app.use("/createTask", createTaskRoutes);


app.post('/create-team', async (req, res) => {
  const query = req.body
  const result = await createTeamCollection.insertOne(query);
  res.send(result);
})

app.get('/create-team', async (req, res) => {
  const email = req.query.email
  if(email) {
    const result = await createTeamCollection.find({email: email}).toArray()
    res.send(result)
  }
  
})
// delete the team by team admin
app.delete('/create-team/:id', async (req, res) => {
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  if(query) {
    const result = await createTeamCollection.deleteOne(query)
    res.send(result)
  }
})
// get the team collection team role
app.get('/create-team/role/:role', async (req, res) => {
  const role = req.params.role
  const email = req.query.email
  if(role && email) {
    const result = await createTeamCollection.find({email:email, role: role}).toArray()
    res.send(result)
  }
})
// get the team data by team name wise
app.get('/team/:teamName', async (req, res) => {
  const query = req.params.teamName;
  if(query) {
    const result = await createTeamCollection.findOne({ teamName: query });
    res.send(result);
  } else {
    res.status(400).send({ message: 'Team name is required' });
  }
});

// add team by team name and team description
app.post('/create-team', async (req, res) => {
  const query = req.body
  const result = await createTeamCollection.insertOne(query);
  res.send(result);
})

// get the team list
app.get('/create-team', async (req, res) => {
  const email = req.query.email
  if(email) {
    const result = await createTeamCollection.find({email: email}).toArray()
    res.send(result)
  }
  
})
// delete the team by team admin
app.delete('/create-team/:id', async (req, res) => {
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  if(query) {
    const result = await createTeamCollection.deleteOne(query)
    res.send(result)
  }
})
// get the team collection team role
app.get('/create-team/role/:role', async (req, res) => {
  const role = req.params.role
  const email = req.query.email
  if(role && email) {
    const result = await createTeamCollection.find({email:email, role: role}).toArray()
    res.send(result)
  }
})
// get the team data by team name wise
app.get('/team/:teamName', async (req, res) => {
  const query = req.params.teamName;
  if(query) {
    const result = await createTeamCollection.findOne({ teamName: query });
    res.send(result);
  } else {
    res.status(400).send({ message: 'Team name is required' });
  }
});
app.get('/search', async (req, res) => {
  const name = req.query.name;
  if(name) {
    const result = await usersCollection.findOne({name: {
      $regex: new RegExp(name, 'i')
    }});
    res.send(result);
  }
})
app.get('/', async (req, res) => {
  res.send('text')
})
connectDB();
app.get("/", (req, res) => {
  res.send("FlowMate is here to help you collaborate with your team!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
