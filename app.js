import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import postsRoutes from "./routes/posts.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
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
  process.env.MONGO_URI || "mongodb://localhost:27017/Blog-System";

// Initialize MongoDB connection with retry
const initializeDB = async () => {
  console.log("Attempting to connect to MongoDB...");
  console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
  console.log("Connection string (masked):", MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  try {
    // Try with optimized settings for serverless
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 1, // Single connection for serverless
      minPoolSize: 0,
      maxIdleTimeMS: 10000
    });
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("Retrying connection in 5 seconds...");
    setTimeout(initializeDB, 5000);
  }
};

// Start the database connection
initializeDB();

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('connecting', () => {
  console.log('🔄 MongoDB connecting...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

export default app;
