import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";

import express from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  getTeamList,
  getNotificationsList,
  updateUserProfile,
  markNotificationRead,
  changeUserPassword,
  deleteUserProfile,
  activateUserProfile,
} from "../controllers/userController.js";
import Stripe from "stripe";

import {
  checkoutSession,
  createPayment,
} from "../controllers/paymentController.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/get-team", protectRoute, isAdminRoute, getTeamList);
router.get("/notifications", protectRoute, getNotificationsList);

router.put("/profile", protectRoute, updateUserProfile);
router.put("/read-noti", protectRoute, markNotificationRead);
router.put("/change-password", protectRoute, changeUserPassword);

router.post("/payment", protectRoute, createPayment);

router.use("/create-checkout-session", checkoutSession);

//   FOR ADMIN ONLY - ADMIN ROUTES
router
  .route("/:id")
  .put(protectRoute, isAdminRoute, activateUserProfile)
  .delete(protectRoute, isAdminRoute, deleteUserProfile);
export default router;
