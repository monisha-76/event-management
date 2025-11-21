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
import bookingRoutes from "./routes/bookingRoutes.js"; // <-- 1. Import Event Routes

const app = express();

// DB connection
connectDB();

// --- Middleware ---

// 2. CORS Configuration for Cookie Handling
app.use(cors({
    // IMPORTANT: Change this to your Next.js frontend URL in development
    // In production, you would set this to your actual domain
    origin: 'http://localhost:3000', 
    // This allows the browser to send the HttpOnly cookie
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
app.use("/api/bookings", bookingRoutes);// <-- 3. Mount Event Routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));