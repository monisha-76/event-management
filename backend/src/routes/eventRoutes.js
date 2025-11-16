// routes/eventRoutes.js

import express from "express";
import { createEvent, updateEvent, deleteEvent,getOrganizerEvents, 
    getEventById } from "../controllers/eventController.js";
import { authRequired, roleRequired } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Middleware: Only authenticated users with role 'organizer' or 'admin' can access these routes.
const organizerAccess = [authRequired, roleRequired("organizer", "admin")];

router.get("/", ...organizerAccess, getOrganizerEvents);

// GET /api/events/:id - Get a single Event by ID
router.get("/:id", ...organizerAccess, getEventById);

// POST /api/events - Create Event
router.post("/", ...organizerAccess, createEvent);

// PUT /api/events/:id - Update Event
// :id is the event ID
router.put("/:id", ...organizerAccess, updateEvent);

// DELETE /api/events/:id - Delete Event
router.delete("/:id", ...organizerAccess, deleteEvent);

export default router;