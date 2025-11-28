"use client";
import { useEffect, useState } from "react";
import API from "../../utils/api";
import { Calendar, MapPin, IndianRupee, User,Ticket, UserCheck} from "lucide-react";

export default function AllEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events/all");
        setEvents(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0826] via-[#2a0c37] to-[#11001a] p-10">

      <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-10 text-center">
        All Events
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
        {events.map((event) => (
          <div
            key={event._id}
            className="
              bg-white/10 
              backdrop-blur-xl 
              border border-white/20 
              rounded-2xl 
              shadow-[0_6px_20px_rgba(0,0,0,0.25)]
              hover:shadow-[0_6px_30px_rgba(255,0,200,0.4)]
              hover:border-purple-400/40
              transition-all duration-300
              overflow-hidden
              hover:scale-[1.025]
            "
          >
            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={event.posterImage}
                alt={event.title}
                className="w-full h-50 object-cover transition-all duration-500 group-hover:scale-110"
              />
            </div>

            {/* Content */}
            <div className="p-4 text-white space-y-3">
              <h2 className="text-xl font-semibold drop-shadow-sm">
                {event.title}
              </h2>

              <p className="text-white/80 text-sm line-clamp-2">
                {event.description}
              </p>

              <div className="space-y-2 text-sm">

                <div className="flex items-center gap-2 text-white/90">
                  <Calendar size={14} className="text-purple-300" />
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2 text-white/90">
                  <MapPin size={14} className="text-green-300" />
                  <span className="font-semibold">Location:</span>{" "}
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-white/90">
                <Ticket size={14} className="text-blue-300" />
                <span className="font-semibold">Total Tickets:</span>
                {event.capacity}
              </div>

              <div className="flex items-center gap-2 text-white/90">
              <UserCheck size={14} className="text-green-300" />
                <span className="font-semibold">Booked:</span>
                {event.currentAttendees}
              </div>

                <div className="flex items-center gap-2 text-white/90">
                  <IndianRupee size={14} className="text-yellow-300" />
                  <span className="font-semibold">Fee:</span>{" "}
                  {event.registrationFee || "Free"}
                </div>

                <div className="flex items-center gap-2 text-white/70">
                  <User size={14} className="text-cyan-300" />
                  <span className="font-semibold">Organizer:</span>{" "}
                  {event.organizer?.name || "Unknown"}
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
