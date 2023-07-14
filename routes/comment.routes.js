import express from "express";
import Comment from "../models/Comment.model.js";
import Post from "../models/Post.model.js";
import mongoose from "mongoose";
// import isAuthenticated from "../middleware/jwt.middleware.js";

const router = express.Router();

// Create a new comment
router.post("/", (req, res, next) => {
  const { author, content, postId } = req.body;
  console.log(req.body);
  Comment.create({ author, content, postId })
    .then((newComment) => {
      console.log(postId);
      return Post.findByIdAndUpdate(
        postId,
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      );
    })
    .then((updatedPost) => res.json(updatedPost))
    .catch((err) => {
      console.error(err); // Log the error
      res.status(500).json(err);
    });
});

// Get comments
router.get("/comments/:commentId", (req, res, next) => {
  const { commentId } = req.params;

  Comment.findById(commentId)
    .populate("author") // Populate the author field with the User document
    .populate("post") // Populate the post field with the Post document
    .then((comment) => res.json(comment))
    .catch((error) => res.json(error));
});

// Update a comment by ID
router.put("/comments/:commentId", (req, res, next) => {
  const { commentId } = req.params;

  Comment.findByIdAndUpdate(commentId, req.body, { new: true })
    .then((updatedComment) => res.json(updatedComment))
    .catch((err) => res.json(err));
});

// Delete a comment by ID
router.delete("/comments/:commentId", (req, res, next) => {
  const { commentId } = req.params;

  Comment.findByIdAndRemove(commentId)
    .then(() =>
      res.json({
        message: `Comment with ${commentId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

export default router;
