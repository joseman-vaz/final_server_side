import dotenv from "dotenv";
import "./db/db.js";

import express from "express";
import errorHandlingMiddleware from "./error-handling/index.js";
import router from "./routes/index.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import dalleRoutes from "./routes/dalle.routes.js";
import cors from "cors";
import isAuthenticated from "./middleware/jwt.middleware.js";

dotenv.config();

const app = express();

import configureMiddleware from "./config/index.js";
configureMiddleware(app);
app.use(express.json({ limit: "100000mb" }));
app.use(cors());
app.use("/user-profile", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);
app.use("/api", router);
app.use("/auth", authRoutes);

app.get("/", async (req, res) => {
  res.send("Hello buddy");
});

errorHandlingMiddleware(app);

export default app;
