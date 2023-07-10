import { Router } from "express";
import User from "../models/User.model.js";
import isAuthenticated from "../middleware/jwt.middleware.js";

const router = Router();

// Fetch user profile
router.get("/user-profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user profile." });
  }
});

// Update user profile
router.put("/user/update", isAuthenticated, async (req, res) => {
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

export default router;
