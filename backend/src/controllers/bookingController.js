// controllers/bookingController.js

import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";

/**
 * POST /api/bookings/:eventId
 * Creates a booking for the logged-in user (req.user.id)
 */
export const bookEvent = async (req, res) => {
  const attendeeId = req.user.id;
  const { eventId } = req.params;

  // Validate event ID
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Invalid event id" });
  }

  try {
    // Get logged-in user data from DB (IMPORTANT)
    const user = await User.findById(attendeeId).select("name email");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    // 0) Fetch event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 1) Check event date
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: "This event has already finished" });
    }

    // 2) Prevent duplicate booking
    const alreadyBooked = await Booking.findOne({
      event: eventId,
      attendee: attendeeId
    });

    if (alreadyBooked) {
      return res.status(400).json({ message: "You have already booked this event" });
    }

    // 3) Increment attendee count if not full
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: { $lt: ["$currentAttendees", "$capacity"] }
      },
      { $inc: { currentAttendees: 1 } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({ message: "Event is full" });
    }

    // 4) Create booking
    const booking = await Booking.create({
      event: eventId,
      attendee: attendeeId,
    });

    // 5) Send Email (SAFE + WITH CHECK)
    try {
      if (!user.email) {
        console.error("❌ Email sending failed: User has no email");
      } else {
        await sendEmail(
          user.email,
               "🎉 Your Event Booking Is Confirmed!",
      `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          
          <h2 style="color:#6a0dad;">🎉 Congratulations! Your Booking is Confirmed</h2>

          <p>Hi <strong>${user.name}</strong>,</p>

          <p>
            Thank you for choosing to be a part of this event!  
            We are excited to let you know that your booking has been 
            <strong style="color:green;">successfully confirmed</strong>.
          </p>

          <h3 style="color:#6a0dad;">📌 Event Details</h3>
          <p><strong>Event:</strong> ${event.title}</p>
          <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${event.location}</p>
          <p><strong>registration fee:</strong> ${event.registrationFee}</p>

          <p>
            This event promises an inspiring and memorable experience.  
            Get ready to learn, connect, and make the most out of your day!
          </p>

          <p style="margin-top:20px;">
            If you have any questions, feel free to reach out to us anytime.
          </p>

          <p>We can’t wait to welcome you! 😊</p>

          <br/>

          <p>Warm regards,</p>
          <p><b>Event Management Team</b></p>

        </div>
      `
        );
      }
    } catch (emailErr) {
      console.error("❌ Email Error:", emailErr);
    }

    return res.status(201).json({ message: "Booked successfully", booking });

  } catch (err) {

    // If duplicate booking error, rollback count
    if (err.code === 11000) {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { currentAttendees: -1 }
      });
    }

    console.error("Booking error:", err);
    return res.status(500).json({ message: "Booking failed", error: err.message });
  }
};


/**
 * DELETE /api/bookings/:eventId
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

    await Booking.findByIdAndDelete(booking._id);

    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentAttendees: -1 }
    });

    return res.json({ message: "Booking cancelled" });

  } catch (err) {
    console.error("Cancel booking error:", err);
    return res.status(500).json({ message: "Failed to cancel booking", error: err.message });
  }
};


/**
 * GET /api/bookings/my
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

export const getOrganizerAttendees = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // Find all events created by organizer
    const events = await Event.find({ organizer: organizerId }).select("_id title");

    const eventIds = events.map(e => e._id);

    // Find all bookings for these events
    const bookings = await Booking.find({ event: { $in: eventIds } })
      .populate("attendee", "name email")
      .populate("event", "title");

    const formatted = bookings.map(b => ({
      attendeeName: b.attendee.name,
      attendeeEmail: b.attendee.email,
      eventTitle: b.event.title,
    }));

    res.json(formatted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load attendees" });
  }
};