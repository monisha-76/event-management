// routes/bookingRoutes.js
import express from "express";
import { bookEvent, cancelBooking, getMyBookings,getOrganizerAttendees } from "../controllers/bookingController.js";
import { authRequired,roleRequired } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All booking routes require authentication
router.post("/:eventId", authRequired, bookEvent);       // POST /api/bookings/:eventId
router.delete("/:eventId", authRequired, cancelBooking); // DELETE /api/bookings/:eventId
router.get("/my", authRequired, getMyBookings); 
router.get("/organizer/attendees",authRequired,roleRequired("organizer"),getOrganizerAttendees);        // GET /api/bookings/my

export default router;
