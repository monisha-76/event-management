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
    posterImage: { // Stores the URL of the uploaded image/banner
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
    // Track current registrations
    currentAttendees: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Add inside eventSchema:

  registrationFee: {
  type: Number,
  required: true,
  min: 0,
},


  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);