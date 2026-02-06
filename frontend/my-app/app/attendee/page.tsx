"use client";

import { useEffect, useState } from "react";
import API from "../utils/api";
import Link from "next/link";

export default function AttendeeHomePage() {
  const [recentEvents, setRecentEvents] = useState([]);

  const slides = [
    "/ce1.jpg",
    "/TRM_332234290-scaled.jpeg",
    "/hire4event.com_-1.jpg",
    "/OIP.jpeg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Background slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Load upcoming events
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await API.get("/api/events/all");

        const upcoming = [...res.data]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3);

        setRecentEvents(upcoming);
      } catch (err) {
        console.log(err);
      }
    };

    loadEvents();
  }, []);

  return (
    <div className="space-y-16">

      {/* HEADER ABOVE IMAGE */}
            <h1 className="text-center text-4xl md:text-6xl font-serif font-bold 
        text-white tracking-tight mb-8">
        Explore Events Around You
        </h1>



      {/* HERO IMAGE FULL */}
      <div
        className="relative w-full h-[420px] sm:h-[520px] md:h-[650px] rounded-2xl shadow-xl overflow-hidden mx-auto mt-4"
        style={{
          backgroundImage: `url(${slides[currentSlide]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 1s ease-in-out",
        }}
      >
        {/* TEXT ON IMAGE */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 bg-black/30">
          <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            Discover. Register. Experience.
          </h2>

          <p className="text-lg text-white/90 mt-3 max-w-xl drop-shadow-md">
            Explore exciting events happening around you. Don’t miss out!
          </p>
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <h2 className="text-2xl font-bold text-white border-l-4 border-purple-400 pl-4">
        Upcoming Events
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-25">
  {recentEvents.map((event) => (
    <div
      key={event._id}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/40 transition-all hover:-translate-y-1"
    >
      <img
        src={event.posterImage}
        className="w-full h-64 object-cover rounded-xl mb-4"
      />

      <h3 className="text-xl font-bold text-white">{event.title}</h3>

      <p className="text-white/70 text-sm mt-1 line-clamp-2">
        {event.description}
      </p>

      <Link
        href={`/attendee/events/${event._id}`}
        className="mt-4 inline-block text-purple-300 hover:text-purple-400 text-base font-semibold"
      >
        View Details →
      </Link>
    </div>
  ))}
</div>

      {/* LINK TO ALL EVENTS */}
      <div className="text-right pb-10">
        <Link
          href="/attendee/events"
          className="text-purple-300 hover:text-purple-400 text-lg font-medium"
        >
          Show all events →
        </Link>
      </div>

    </div>
  );
}
