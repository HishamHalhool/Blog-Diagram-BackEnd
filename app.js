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

// Health check endpoint
app.get("/health", (req, res) => {
  const connectionStates = {
    0: "disconnected",
    1: "connected", 
    2: "connecting",
    3: "disconnecting"
  };
  
  const dbStatus = connectionStates[mongoose.connection.readyState] || "unknown";
  res.json({ 
    status: "ok", 
    database: dbStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    mongoUriExists: !!process.env.MONGO_URI,
    connectionState: mongoose.connection.readyState
  });
});

// TODO: Add routes here

const PORT = process.env.PORT;
const MONGO_URI =
 "mongodb+srv://hishamahmedhassan99:Hals879$@hishamdb.yt63gwt.mongodb.net/Blog-System?retryWrites=true&w=majority" || "mongodb://localhost:27017/blog-system";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

export default app;
