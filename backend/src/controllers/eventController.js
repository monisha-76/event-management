// controllers/eventController.js

import Event from '../models/Event.js';
import cloudinary from "cloudinary";
import fs from "fs";


// --- Create Event (Organizer Feature) ---
export const createEvent = async (req, res) => {
  try {
    const organizer = req.user.id;

    const posterImage = req.file?.path; // Cloudinary URL

    if (!posterImage) {
      return res.status(400).json({ message: "Event image is required" });
    }

    const { title, description, capacity, date, location, registrationFee } = req.body;


    const event = await Event.create({
      organizer,
      title,
      description,
      posterImage,
      capacity,
      date,
      location,
      registrationFee,
    });

    res.status(201).json({
      message: "Event created successfully!",
      event,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Public: Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email");
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
};


// --- Update Event (Organizer Feature) ---

export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const organizerId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Security Check: Only the organizer can edit
    if (event.organizer.toString() !== organizerId) {
      return res.status(403).json({ message: "Access denied." });
    }

    let updates = req.body;

    // Prevent organizer from changing these
    delete updates.currentAttendees;
    delete updates.status;

    // -------------------------------
    //  HANDLE POSTER IMAGE UPDATE
    // -------------------------------
    if (req.file) {
      const uploaded = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "event-posters",
      });

      updates.posterImage = uploaded.secure_url;

      // Remove temp file
      fs.unlinkSync(req.file.path);
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Event updated successfully.",
      event: updatedEvent,
    });

  } catch (err) {
    res.status(400).json({ message: "Failed to update event.", error: err.message });
  }
};

// --- Delete Event (Organizer Feature) ---
export const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const organizerId = req.user.id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // Security Check: Only the original organizer (or an Admin) can delete
        if (event.organizer.toString() !== organizerId) {
            return res.status(403).json({ message: "Access denied. You are not the owner of this event." });
        }

        await Event.findByIdAndDelete(eventId);

        res.json({ message: "Event deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete event.", error: err.message });
    }
};
// controllers/eventController.js (Add to your existing file)

// ... existing imports and CRUD functions (createEvent, updateEvent, deleteEvent) ...

// --- Get All Events Created by the Current Organizer ---
export const getOrganizerEvents = async (req, res) => {
    try {
        const organizerId = req.user.id; 

        // Find all events where the organizer field matches the current user's ID
        const events = await Event.find({ organizer: organizerId })
     .sort({ date: 1 })
      .populate("organizer", "name email"); 


        if (events.length === 0) {
            return res.status(200).json({ message: "You have not created any events yet.", events: [] });
        }

        res.status(200).json({ events });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch events.", error: err.message });
    }
};

// --- Get Single Event by ID ---
export const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;
        const organizerId = req.user.id; 

       const event = await Event.findById(eventId)
       .populate("organizer", "name email");

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // Security Check: Only the original organizer (or an Admin) can view their event details
        // Note: Admin access will be handled by roleRequired in the routes file.
       if (event.organizer._id.toString() !== organizerId) {
            return res.status(403).json({ message: "Access denied. You are not the organizer of this event." });
        }

        res.status(200).json({ event });
    } catch (err) {
        // Handle cases where the ID format is invalid (e.g., Mongoose CastError)
        res.status(500).json({ message: "Failed to fetch event.", error: err.message });
    }
};