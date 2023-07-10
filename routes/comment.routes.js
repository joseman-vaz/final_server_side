import express from "express";
import Comment from "../models/Comment.model.js";
import isAuthenticated from "../middleware/jwt.middleware.js";
const router = express.Router();

// get all comments
router.get("/:imageId", async (req, res) => {
  try {
    const comments = await Comment.find({
      imageId: req.params.imageId,
    }).populate("author");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new comment
router.post("/comments", async (req, res) => {
  try {
    const comment = new Comment(req.body);
    const savedComment = await comment.save();

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a comment by ID
router.put("/comments/:_id", async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true }
    );

    res.json(updatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a comment by ID
router.delete("/comments/:_id", async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params._id);

    res.json(deletedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
