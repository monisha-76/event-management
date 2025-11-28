"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [registrationFee, setRegistrationFee] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const backendURL = "http://localhost:5000";

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!imageFile) {
      return toast.error("Please upload an event image");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("capacity", capacity);
    formData.append("date", new Date(date).toISOString()); // VERY IMPORTANT
    formData.append("location", location);

    if (registrationFee) {
      formData.append("registrationFee", registrationFee);
    }

    // MUST MATCH BACKEND FIELD NAME
    formData.append("posterImage", imageFile);

    try {
      const res = await fetch(`${backendURL}/api/events`, {
        method: "POST",
        credentials: "include", // required for JWT cookie
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Failed to create event");
      }

      toast.success("Event created successfully!");

      window.location.href = "/organizer"; // redirect
    } catch (err) {
      console.log(err);
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-2xl">
        <h2 className="text-black text-3xl font-bold mb-6 text-center">Create New Event</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
           className="w-full p-3 border rounded-lg text-black"
            required
          />

          <textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
           className="w-full p-3 border rounded-lg text-black"
            rows={4}
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border rounded-lg text-black"
            required
          />

          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
           className="w-full p-3 border rounded-lg text-black"
            required
          />

          <input
            type="number"
            placeholder="Registration Fee"
            value={registrationFee}
            onChange={(e) => setRegistrationFee(e.target.value)}
            className="w-full p-3 border rounded-lg text-black"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border rounded-lg text-black"
            required
          />

          <div>
            <label className="font-semibold">Event Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e: any) => setImageFile(e.target.files[0])}
              className="w-full p-2 border rounded-lg mt-2 text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-black py-3 rounded-lg text-lg font-semibold hover:bg-purple-700"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
