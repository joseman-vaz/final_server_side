import express from "express";
import Comment from "../models/Comment.model.js";
import Post from "../models/Post.model.js";
import mongoose from "mongoose";
import User from "../models/User.model.js";
// import isAuthenticated from "../middleware/jwt.middleware.js";

const router = express.Router();

// Create a new comment
router.post("/comments", async (req, res, next) => {
  const { author, content, postId } = req.body;

  try {
    let newComment = await Comment.create({ author, content, postId });

    let updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: newComment._id },
      },
      { new: true }
    );

    // Fetch the new comment again with author populated
    newComment = await Comment.findById(newComment._id);
    // .populate("author");

    // Return new comment with populated author
    res.json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get comments
router.get("/comments/:commentId", (req, res, next) => {
  const { commentId } = req.params;
  console.log(commentId);
  Comment.findById(commentId)
    .populate("author") // Populate the author field with the User document
    .populate("post") // Populate the post field with the Post document
    .then((comment) => res.json(comment))
    .catch((error) => res.json(error));
});

// Update a comment by ID
router.put("/comments/:commentId", (req, res, next) => {
  const { commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Comment.findByIdAndUpdate(commentId, req.body, { new: true })
    .then((updatedComment) => res.json(updatedComment))
    .catch((err) => res.json(err));
});

// Delete a comment by ID
router.delete("/comments/:commentId", (req, res, next) => {
  const { commentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Comment.findByIdAndRemove(commentId)
    .then(() =>
      res.json({
        message: `Comment with ${commentId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

export default router;
