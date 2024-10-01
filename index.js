const express = require("express");
const cors = require("cors");
const { connectDB, db } = require("./utils/db");
const memberRoutes = require("./routes/memberRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
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
const createTeamCollection = db.collection('create-team')
app.use("/payments", paymentRoutes);
app.use("/team", memberRoutes);
app.use("/contacts", contactRoutes);
app.use("/users", userRoutes);

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
app.delete('/create-team/:id', async (req, res) => {
  const id = req.params.id
  const query = {_id: new ObjectId(id)}
  if(query) {
    const result = await createTeamCollection.deleteOne(query)
    res.send(result)
  }
})
app.get('/create-team/role/:role', async (req, res) => {
  const role = req.params.role
  const email = req.query.email
  if(role && email) {
    const result = await createTeamCollection.find({email:email, role: role}).toArray()
    res.send(result)
  }
})

app.get('/team/:teamName', async (req, res) => {

})
connectDB();
app.get("/", (req, res) => {
  res.send("FlowMate is here to help you collaborate with your team!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
