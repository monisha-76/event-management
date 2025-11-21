// routes/bookingRoutes.js
import express from "express";
import { bookEvent, cancelBooking, getMyBookings } from "../controllers/bookingController.js";
import { authRequired } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All booking routes require authentication
router.post("/:eventId", authRequired, bookEvent);       // POST /api/bookings/:eventId
router.delete("/:eventId", authRequired, cancelBooking); // DELETE /api/bookings/:eventId
router.get("/my", authRequired, getMyBookings);          // GET /api/bookings/my

export default router;
