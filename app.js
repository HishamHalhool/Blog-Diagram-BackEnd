const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const postsRoutes = require("./routes/posts");
app.use("/api/posts", postsRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Blog System API");
});

// TODO: Add routes here

const PORT = process.env.PORT;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/blog-system";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
