// routes/eventRoutes.js

import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents,
  getEventById,
  getAllEvents,
} from "../controllers/eventController.js";

import { authRequired, roleRequired } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

// Only Organizer or Admin can access event CRUD
const organizerAccess = [authRequired, roleRequired("organizer", "admin")];

/* ------------------------------------------------------------------
   MUST COME FIRST – GET all events created by the current organizer
-------------------------------------------------------------------*/
router.get("/organizer", ...organizerAccess, getOrganizerEvents);

/* ---------------------- Create Event ---------------------------- */
router.post("/", ...organizerAccess, upload.single("posterImage"), createEvent);

router.get("/all", getAllEvents);

/* ---------------------- Get Single Event by ID ------------------ */
router.get("/:id", getEventById);

/* ---------------------- Update Event ----------------------------- */
router.put("/:id", ...organizerAccess, upload.single("posterImage"), updateEvent);

/* ---------------------- Delete Event ----------------------------- */
router.delete("/:id", ...organizerAccess, deleteEvent);

export default router;
