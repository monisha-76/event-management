"use client";

import { useEffect, useState } from "react";
import API from "../../utils/api";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default function AttendeeProfilePage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userRes = await API.get("/auth/me");
      const bookingRes = await API.get("/bookings/my");

      setUser(userRes.data);
      setName(userRes.data.name);
      setBookings(bookingRes.data.bookings);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load data");
      console.log(err);
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      await API.put("/auth/update-profile", { name, password });
      toast.success("Profile updated");
      setEditMode(false);
      loadData();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-300">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0f2d] to-black text-white p-6 space-y-10">

      {/* PROFILE CARD */}
      <div className="bg-white text-black rounded-2xl shadow-xl p-6 relative">
        <button
          className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full"
          onClick={() => setEditMode(true)}
        >
          <Pencil size={18} />
        </button>

        <h2 className="text-2xl font-semibold">{user?.name}</h2>
        <p className="text-gray-700">{user?.email}</p>
        <p className="text-blue-600 mt-2">Role: Attendee</p>
      </div>

      {/* EDIT PROFILE FORM */}
      {editMode && (
        <div className="bg-white text-black rounded-xl shadow p-6">
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

      {/* BOOKED EVENTS SECTION */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>

        {bookings.length === 0 ? (
          <p className="text-gray-300">No bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white/10 text-white p-4 rounded-xl backdrop-blur-xl shadow-lg">
                <img
                  src={booking.event.posterImage}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <h4 className="text-lg font-bold mt-3">{booking.event.title}</h4>

                <p className="text-gray-300 text-sm mt-1">
                  📅 {new Date(booking.event.date).toLocaleDateString()}
                </p>

                <p className="text-gray-300 text-sm">
                  📍 {booking.event.location}
                </p>

                <Link
                  href={`/attendee/events/${booking.event._id}`}
                  className="mt-4 inline-block text-purple-300 hover:text-purple-400"
                >
                  View Event →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
