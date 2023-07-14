import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Comment from "../models/Comment.model.js";
import Post from "../models/Post.model.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//GET ALL POSTS//
router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetching posts failed, please try again",
    });
  }
});

// CREATE A POST //
router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    const photoUrl = await cloudinary.uploader.upload(photo);
    console.log(photoUrl);
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
      comments: [],
    });

    res.status(200).json({ success: true, data: newPost });
  } catch (err) {
    console.log("Error in POST /post:", err);
    res.status(500).json({
      success: false,
      message: "Unable to create a post, please try again",
    });
  }
});

router.route("/image/:_id").get(async (req, res) => {
  try {
    const postId = req.params._id;
    const post = await Post.findById(postId).populate("comments");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }
    const comments = post.comments;
    const imageUrl = post.photo;
    const name = post.name;
    const prompt = post.prompt;
    res.status(200).json({ success: true, imageUrl, comments, name, prompt });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetching image failed, please try again later",
    });
  }
});

router.route("/:postId/comments").get(async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("comments");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    const comments = post.comments;
    res.status(200).json({ success: true, comments });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetching comments failed, please try again later",
    });
  }
});

export default router;
