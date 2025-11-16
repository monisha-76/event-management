// controllers/eventController.js

import Event from '../models/Event.js';


// --- Create Event (Organizer Feature) ---
export const createEvent = async (req, res) => {
    try {
        // The organizer ID is securely obtained from the JWT payload via authRequired middleware
        const organizer = req.user.id; 

        // Extract event details from the request body
        const { title, description, posterUrl, capacity, date, location } = req.body;

        const event = await Event.create({
            organizer,
            title,
            description,
            posterUrl,
            capacity,
            date,
            location,
            // Status defaults to 'Pending' as defined in the model
        });

        res.status(201).json({ message: "Event created successfully and is pending admin approval.", event });
    } catch (err) {
        // Handle validation errors (e.g., missing required fields)
        res.status(400).json({ message: "Failed to create event.", error: err.message });
    }
};

// --- Update Event (Organizer Feature) ---
export const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const updates = req.body;
        const organizerId = req.user.id; 

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // Security Check: Only the original organizer (or an Admin) can update
        // We only check for the organizer here, as roleRequired will handle Admin access
        if (event.organizer.toString() !== organizerId) {
            return res.status(403).json({ message: "Access denied. You are not the owner of this event." });
        }
        
        // Prevent organizer from changing the 'status' (Admin job) or 'currentAttendees'
        delete updates.status; 
        delete updates.currentAttendees;

        const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, { new: true, runValidators: true });

        res.json({ message: "Event updated successfully.", event: updatedEvent });
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
        const events = await Event.find({ organizer: organizerId }).sort({ date: 1 });

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

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        // Security Check: Only the original organizer (or an Admin) can view their event details
        // Note: Admin access will be handled by roleRequired in the routes file.
        if (event.organizer.toString() !== organizerId) {
            return res.status(403).json({ message: "Access denied. You are not the organizer of this event." });
        }

        res.status(200).json({ event });
    } catch (err) {
        // Handle cases where the ID format is invalid (e.g., Mongoose CastError)
        res.status(500).json({ message: "Failed to fetch event.", error: err.message });
    }
};