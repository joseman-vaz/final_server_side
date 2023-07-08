import dotenv from "dotenv";
import "./db/db.js";

import express from "express";
import errorHandlingMiddleware from "./error-handling/index.js";
import router from "./routes/index.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import dalleRoutes from "./routes/dalle.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import cors from "cors";
import bodyParser from "body-parser";
import isAuthenticated from "./middleware/jwt.middleware.js";
import configureMiddleware from "./config/index.js";
dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

configureMiddleware(app);
app.use(cors());

app.use("/user-profile", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/dalle", dalleRoutes);
app.use("/api", router);
app.use("/auth", authRoutes);

app.get("/", async (req, res) => {
  res.send("Hello buddy");
});

errorHandlingMiddleware(app);

export default app;
