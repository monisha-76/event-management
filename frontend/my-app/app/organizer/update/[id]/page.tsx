"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "../../../utils/api";
import toast from "react-hot-toast";

export default function UpdateEventPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState<number | string>("");
  const [registrationFee, setRegistrationFee] = useState<number | string>("");

  const [posterImage, setPosterImage] = useState<File | null>(null);

  // ======================================================
  // FETCH EVENT DATA
  // ======================================================
  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/${id}`);
      const ev = res.data.event;

      if (!ev) {
        toast.error("Event not found");
        router.push("/account");
        return;
      }

      setEventData(ev);

      setTitle(ev.title);
      setDescription(ev.description);
      setDate(ev.date.split("T")[0]);
      setLocation(ev.location);
      setCapacity(ev.capacity);
      setRegistrationFee(ev.registrationFee);

      setLoading(false);
    } catch (error) {
      toast.error("Failed to load event");
      setLoading(false);
      router.push("/account");
    }
  };

  // ======================================================
  // HANDLE IMAGE UPLOAD
  // ======================================================
  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPosterImage(e.target.files[0]);
    }
  };

  // ======================================================
  // UPDATE EVENT
  // ======================================================
  const updateEvent = async () => {
    if (!title.trim() || !description.trim() || !location.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("location", location);
      formData.append("capacity", String(capacity));
      formData.append("registrationFee", String(registrationFee));

      // Only append poster if a new one was selected
      if (posterImage) {
        formData.append("posterImage", posterImage);
      }

      await API.put(`/events/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event updated successfully");
      router.push("/organizer");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-300">Loading event...</p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f2d] to-black text-white p-6">
      <div className="max-w-2xl mx-auto bg-white text-black p-6 rounded-2xl shadow-2xl">

        <h2 className="text-2xl font-semibold mb-5 text-center text-black">
          Update Event
        </h2>

        {/* POSTER PREVIEW */}
        <div className="mb-4">
          {posterImage ? (
            <img
              src={URL.createObjectURL(posterImage)}
              className="w-full h-52 object-cover rounded-lg shadow-md"
            />
          ) : eventData?.posterImage ? (
            <img
              src={eventData.posterImage}
              className="w-full h-52 object-cover rounded-lg shadow-md"
            />
          ) : null}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handlePosterUpload}
          className="w-full border p-2 rounded mb-4"
        />

        {/* TITLE */}
        <input
          className="w-full border p-2 rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
        />

        {/* DESCRIPTION */}
        <textarea
          className="w-full border p-2 rounded mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Description"
        />

        {/* DATE */}
        <input
          className="w-full border p-2 rounded mb-3"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* LOCATION */}
        <input
          className="w-full border p-2 rounded mb-3"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        />

        {/* CAPACITY */}
        <input
          className="w-full border p-2 rounded mb-3"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="Capacity"
        />

        {/* FEE */}
        <input
          className="w-full border p-2 rounded mb-3"
          type="number"
          value={registrationFee}
          onChange={(e) => setRegistrationFee(e.target.value)}
          placeholder="Registration Fee"
        />

        {/* BUTTONS */}
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            onClick={() => router.push("/organizer")}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            onClick={updateEvent}
          >
            Update Event
          </button>
        </div>

      </div>
    </div>
  );
}
