"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API from "../../utils/api";

export default function EventListingPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
  try {
    const res = await API.get("/api/events/all");

    // FIX: backend returns an array directly
    const data = Array.isArray(res.data) ? res.data : [];

    setEvents(data);
  } catch (err) {
    console.error("Error fetching events:", err);
    setEvents([]);
  } finally {
    setLoading(false);
  }
};
;

  const filteredEvents = events?.filter((event) =>
    event.title?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen px-6 lg:px-20 py-12">

      {/* PAGE HEADER */}
      <h1 className="text-center text-5xl font-extrabold text-purple-300 drop-shadow-xl tracking-wide">
        Discover All Events
      </h1>

      {/* SEARCH BAR */}
      <div className="flex justify-center mt-10">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl px-5 py-3 rounded-2xl bg-white/10 border border-white/20 
                     text-white backdrop-blur-xl placeholder-purple-200 focus:outline-none 
                     focus:ring-2 focus:ring-purple-500 transition-all"
        />
      </div>

      {/* LOADING TEXT */}
      {loading && (
        <p className="text-center text-purple-200 mt-12 text-lg animate-pulse">
          Loading events...
        </p>
      )}

      {/* EVENT GRID */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-14">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl 
                           shadow-xl hover:shadow-purple-500/40 transform hover:-translate-y-1 
                           transition-all p-5"
              >
                <img
                  src={event.posterImage}
                  className="w-full h-64 object-cover rounded-xl mb-4 
                             hover:scale-105 transition-all duration-300"
                />

                <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                <p className="text-purple-200 text-sm mt-1">Date: {new Date(event.date).toLocaleDateString()}</p>
                <p className="text-purple-200 text-sm mt-1">Location : {event.location}</p>
                <p className="text-purple-300 text-sm font-medium mt-1">
                 Available Tickets: {event.availableSeats}
                </p>

                <Link
                  href={`/attendee/events/${event._id}`}
                  className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 
                             text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  View Details →
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-purple-200 text-lg col-span-3">
              No events found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
