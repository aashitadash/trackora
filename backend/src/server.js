import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import eventRoutes from "./routes/eventRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import heatmapRoutes from "./routes/heatmapRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/heatmap", heatmapRoutes);

// Test Route
app.get("/test", (req, res) => {
  res.send("TEST WORKING");
});

// Home Route
app.get("/", (req, res) => {
  res.send("Trackora API Running");
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

// Server Port
const PORT = 8000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});