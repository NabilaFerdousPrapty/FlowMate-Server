import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewaves.js";
import routes from "./routes/index.js";
import { dbConnection } from "./utils/index.js";
import Stripe from "stripe";

dotenv.config();
dbConnection();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://flowmate-letscollaborate.web.app/",
    ],

    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

const { SERVER_PORT, STRIPE_PRIVATE_KEY, STRIPE_PRICE_ID, CLIENT_URL } =
  process.env;

const stripe = new Stripe(STRIPE_PRIVATE_KEY, {
  apiVersion: "2022-11-15",
});

const quantity = 1;

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: `${CLIENT_URL}/success`,
      cancel_url: `${CLIENT_URL}`,
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: quantity,
        },
      ],
      mode: "subscription",
    });
    console.log("session: ", session.id, session.url, session);

    // get id, save to user, return url
    const sessionId = session.id;
    console.log("sessionId: ", sessionId);

    // save session.id to the user in your database

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/stripe-session", async (req, res) => {
  console.log("req.body: ", req.body);
  const { userId } = req.body;
  console.log("userId: ", userId);

  const db = req.app.get("db");

  // get user from you database
  const user = {
    stripe_session_id: "asdfpouhwf;ljnqwfpqo",
    paid_sub: false,
  };

  if (!user.stripe_session_id || user.paid_sub === true)
    return res.send("fail");

  try {
    // check session
    const session = await stripe.checkout.sessions.retrieve(
      user.stripe_session_id
    );
    console.log("session: ", session);

    // update the user
    if (session && session.status === "complete") {
      let updatedUser = await db.update_user_stripe(userId, true);
      updatedUser = updatedUser[0];
      console.log(updatedUser);

      return res.send("success");
    } else {
      return res.send("fail");
    }
  } catch (error) {
    // handle the error
    console.error(
      "An error occurred while retrieving the Stripe session:",
      error
    );
    return res.send("fail");
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));
app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
