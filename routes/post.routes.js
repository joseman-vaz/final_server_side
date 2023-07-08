import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

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
    const imageId = req.params._id;
    const post = await Post.findById(imageId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const imageUrl = post.photo;
    res.status(200).json({ success: true, imageUrl });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Fetching image failed, please try again later",
    });
  }
});

export default router;
