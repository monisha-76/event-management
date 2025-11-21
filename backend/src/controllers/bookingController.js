// controllers/bookingController.js

import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import mongoose from "mongoose";

/**
 * POST /api/bookings/:eventId
 * Creates a booking for the logged-in user (req.user.id).
 * - Prevents duplicate booking
 * - Atomically increments event.currentAttendees only if capacity not exceeded
 */
export const bookEvent = async (req, res) => {
  const attendeeId = req.user.id;
  const { eventId } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event id" });
  }

  try {
    // 0) Get event first — to check date
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ❗ CHECK EVENT DATE
    const now = new Date();
    const eventDate = new Date(event.date);

    if (eventDate < now) {
      return res.status(400).json({ message: "This event has already finished" });
    }

    // 1) Already booked?
    const existing = await Booking.findOne({
      event: eventId,
      attendee: attendeeId
    });

    if (existing) {
      return res.status(400).json({ message: "You have already booked this event" });
    }

    // 2) Increment currentAttendees only if capacity not exceeded
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: { $lt: ["$currentAttendees", "$capacity"] }
      },
      { $inc: { currentAttendees: 1 } },
      { new: true }
    );

    if (!updatedEvent) {
      const exists = await Event.findById(eventId);
      if (!exists) return res.status(404).json({ message: "Event not found" });

      return res.status(400).json({ message: "Event is full" });
    }

    // 3) Create booking
    const booking = await Booking.create({
      event: eventId,
      attendee: attendeeId,
    });

    return res.status(201).json({ message: "Booked successfully", booking });

  } catch (err) {
    if (err.code === 11000) {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { currentAttendees: -1 }
      });
      return res.status(400).json({ message: "You have already booked this event" });
    }

    console.error("Booking error:", err);
    return res.status(500).json({ message: "Booking failed", error: err.message });
  }
};


/**
 * DELETE /api/bookings/:eventId
 * Cancel logged-in user's booking for eventId.
 */
export const cancelBooking = async (req, res) => {
  const attendeeId = req.user.id;
  const { eventId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event id" });
  }

  try {
    const booking = await Booking.findOne({ event: eventId, attendee: attendeeId });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Remove booking
    await Booking.findByIdAndDelete(booking._id);

    // Decrement event.currentAttendees safely (min 0)
    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentAttendees: -1 },
    });

    return res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error("Cancel booking error:", err);
    return res.status(500).json({ message: "Failed to cancel booking", error: err.message });
  }
};

/**
 * GET /api/bookings/my
 * Return all bookings for the logged-in user, populated with event data
 */
export const getMyBookings = async (req, res) => {
  const attendeeId = req.user.id;

  try {
    const bookings = await Booking.find({ attendee: attendeeId })
      .populate({
        path: "event",
        populate: { path: "organizer", select: "name email" },
      })
      .sort({ createdAt: -1 });

    return res.json({ bookings });
  } catch (err) {
    console.error("Get bookings error:", err);
    return res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};
