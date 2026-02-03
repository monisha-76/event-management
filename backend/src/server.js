// server.js

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import connectDB from "./config/db.js";
import "./config/cloudinary.js";


// Import all route files
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";


// <-- 1. Import Event Routes

const app = express();

// DB connection
connectDB();

// --- Middleware ---

// 2. CORS Configuration for Cookie Handling
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser()); 

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// --- Routes ---
// Authentication Routes
app.use("/api/auth", authRoutes);

// Event Management Routes (Organizer Core Feature)
app.use("/api/events", eventRoutes); 
app.use("/api/bookings", bookingRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));