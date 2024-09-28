const express = require("express");
const cors = require("cors");
const { connectDB } = require("./utils/db");
const memberRoutes = require("./routes/memberRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");

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

app.use("/payments", paymentRoutes);
app.use("/team", memberRoutes);
app.use("/contacts", contactRoutes);
app.use("/users", userRoutes);

connectDB();
app.get("/", (req, res) => {
  res.send("FlowMate is here to help you collaborate with your team!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
