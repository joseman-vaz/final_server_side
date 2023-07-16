import { Router } from "express";
import User from "../models/User.model.js";
import isAuthenticated from "../middleware/jwt.middleware.js";

const router = Router();

// Fetch user profile
router.get("/profile", isAuthenticated, async (req, res) => {
  console.log("User ID from isAuthenticated middleware:", req.payload._id);
  try {
    const user = await User.findById(req.payload._id);
    console.log("Fetched user:", user);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user profile." });
  }
});

// Fetch user by ID
router.get("/:_id", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user." });
  }
});

// Update user profile
router.put("/update", isAuthenticated, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating user profile." });
  }
});

// Delete user profile
router.delete("/delete", isAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: "User profile deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting user profile." });
  }
});

export default router;
