// models/Event.js

import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links the event to the organizer's User ID
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    posterUrl: { // Stores the URL of the uploaded image/banner
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    date: {
      type: Date, // Stores date and time
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    // New field for Admin Dashboard requirement
    status: {
      type: String,
      enum: ["Pending", "Approved", "Cancelled"],
      default: "Pending", // New events start as Pending for admin review
    },
    // Track current registrations
    currentAttendees: {
      type: Number,
      default: 0,
      min: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);