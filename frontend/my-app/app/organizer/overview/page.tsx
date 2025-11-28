"use client";

import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Calendar, Users, FolderKanban, Search } from "lucide-react";

export default function OrganizerOverviewPage() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    myEvents: 0,
  });

  const [attendees, setAttendees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  // ---------- Fetch Overview Cards ----------
  const fetchOverview = async () => {
    try {
      const res = await API.get("/events/organizer/overview");
      setStats(res.data);
    } catch (error) {
      console.log("Error loading overview:", error);
    }
  };

  // ---------- Fetch Organizer Attendees ----------
  const fetchAttendees = async () => {
    try {
      const res = await API.get("/bookings/organizer/attendees");
      setAttendees(res.data);
      setFiltered(res.data);
    } catch (error) {
      console.log("Error loading attendees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchAttendees();
  }, []);

  // ---------- Search Filter ----------
  useEffect(() => {
    const s = search.toLowerCase();

    const result = attendees.filter(
      (a) =>
        a.attendeeName.toLowerCase().includes(s) ||
        a.attendeeEmail.toLowerCase().includes(s) ||
        a.eventTitle.toLowerCase().includes(s)
    );

    setFiltered(result);
  }, [search, attendees]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Organizer Overview</h1>

      {/* ======= STAT CARDS ======= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Events */}
        <div className="p-6 bg-purple-200 rounded-2xl shadow-md border flex items-center gap-4 hover:shadow-lg transition-all">
          <Calendar size={48} className="text-purple-700" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Total Events</h2>
            <p className="text-4xl font-bold text-gray-900 mt-1">
              {stats.totalEvents}
            </p>
          </div>
        </div>

        {/* Total Attendees */}
        <div className="p-6 bg-purple-200 rounded-2xl shadow-md border flex items-center gap-4 hover:shadow-lg transition-all">
          <Users size={48} className="text-purple-700" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Total Attendees</h2>
            <p className="text-4xl font-bold text-gray-900 mt-1">
              {stats.totalAttendees}
            </p>
          </div>
        </div>

        {/* My Events */}
        <div className="p-6 bg-purple-200 rounded-2xl shadow-md border flex items-center gap-4 hover:shadow-lg transition-all">
          <FolderKanban size={48} className="text-purple-700" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">My Events</h2>
            <p className="text-4xl font-bold text-gray-900 mt-1">
              {stats.myEvents}
            </p>
          </div>
        </div>

      </div>

      {/* ======= ATTENDEE TABLE ======= */}
      <div className="mt-10 bg-white p-6 rounded-2xl shadow border">

        <h2 className="text-2xl text-black font-bold mb-4">Attendees List</h2>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search attendee..."
            className="w-full pl-10 pr-4 py-2 text-gray-600 border rounded-xl focus:ring-2 focus:ring-purple-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-gray-600">Loading attendees...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-600">No attendees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl">
              <thead className="bg-purple-200">
                <tr>
                  <th className="px-4 py-3 text-gray-800 text-left font-semibold">Attendee Name</th>
                  <th className="px-4 py-3 text-gray-800 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-gray-800 text-left font-semibold">Event</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 bg-pink-100 text-black">{item.attendeeName}</td>
                    <td className="px-4 py-3  bg-pink-100 text-black">{item.attendeeEmail}</td>
                    <td className="px-4 py-3  bg-pink-100 text-black">{item.eventTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
