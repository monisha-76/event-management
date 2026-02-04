"use client";

import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userRes = await API.get("/api/auth/me");
      const eventRes = await API.get("/api/events/organizer");

      setUser(userRes.data);
      setName(userRes.data.name);
      setEvents(eventRes.data.events);

      setLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load account");
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      await API.put("/api/auth/update-profile", { name, password });
      toast.success("Profile updated");
      setEditMode(false);
      fetchData();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const deleteEvent = async (id) => {
    try {
      await API.delete(`/api/events/${id}`);
      toast.success("Event deleted");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-300">Loading...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-red-400">User not found</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f2d] to-black text-white p-6 space-y-8">

      {/* PROFILE CARD */}
      <div className="bg-white text-black rounded-2xl shadow-xl p-6 relative border">
        <button
          className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          onClick={() => setEditMode(true)}
        >
          <Pencil size={18} />
        </button>

        <h2 className="text-2xl font-semibold mb-2">{user?.name}</h2>
        <p className="text-gray-700">{user?.email}</p>
        <p className="text-blue-600 mt-2">Role: Organizer</p>
      </div>

      {/* EDIT PROFILE FORM */}
      {editMode && (
        <div className="bg-white text-black rounded-xl shadow p-6 border">
          <h3 className="text-lg font-semibold mb-4">Update Profile</h3>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2 mb-3"
            placeholder="Name"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2 mb-3"
            type="password"
            placeholder="New Password (optional)"
          />

          <button
            onClick={updateProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* EVENTS LIST */}
      {/* EVENTS LIST */}
<div>
  <h3 className="text-xl font-semibold mb-4 text-white">Your Events</h3>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
    {events.map((event) => (
      <div
        key={event._id}
        className="bg-gray-300 text-black shadow rounded-xl p-4 border"
      >
        <img
          src={event.posterImage}
          alt="Poster"
          className="w-100 h-50 object-cover rounded-md"
        />

        {/* TITLE */}
        <h4 className="text-xl font-bold mt-3">{event.title}</h4>

        {/* DESCRIPTION */}
        <p className="text-gray-700 text-sm mt-1">{event.description}</p>

        {/* DATE */}
        <p className="text-gray-600 text-sm mt-2">
          📅 {new Date(event.date).toLocaleDateString()}
        </p>

        {/* LOCATION */}
        <p className="text-gray-600 text-sm">📍 {event.location}</p>

        {/* CAPACITY */}
        <p className="text-gray-600 text-sm">🎟️ Total tickets: {event.capacity}</p>

        
        <p className="text-gray-600 text-sm">🟢 Booked: {event.currentAttendees}</p>

        {/* FEE */}
        <p className="text-gray-600 text-sm">💰 Fee: ₹{event.registrationFee}</p>

        <div className="flex gap-3 mt-4">
          <button className="px-3 py-1 bg-blue-500 text-white rounded"
           onClick={() => router.push(`/organizer/update/${event._id}`)}
          >
            Edit
          </button>

          <button
            className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-1"
            onClick={() => deleteEvent(event._id)}
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}
