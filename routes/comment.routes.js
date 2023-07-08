import express from "express";
import Comment from "../models/Comment.model.js";

const router = express.Router();

// get all comments
router.get("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params; // Use req.params instead of req.query
    const comments = await Comment.find({ postId });
    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create a new comment
router.post("/comments", async (req, res) => {
  const { postId, author, content } = req.body;

  try {
    const comment = new Comment({ postId, author, content });
    await comment.save();
    res.status(201).json({ success: true, comment });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Could not create comment." });
  }
});

// Update a comment by ID
router.put("/comments/:_id", async (req, res) => {
  const { _id } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(
      _id,
      { content },
      { new: true }
    );
    res.status(200).json({ success: true, comment });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Could not update comment." });
  }
});

// Delete a comment by ID
router.delete("/comments/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    await Comment.findByIdAndRemove(_id);
    res.status(200).json({ success: true, message: "Comment deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Could not delete comment." });
  }
});

export default router;
