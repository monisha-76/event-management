"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "../../../utils/api";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, MapPin, IndianRupee, Mail } from "lucide-react";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const res = await API.get(`/api/events/${id}`);
      setEvent(res.data.event);
    } catch (err) {
      console.error("Error fetching event details:", err);
      toast.error("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
  const confirmBooking = window.confirm(
    "Are you sure you want to book this event?\n\nA confirmation email will be sent to you."
  );

  if (!confirmBooking) return;

  try {
    await API.post(`/api/bookings/${id}`,{});
    toast.success("Event booked successfully! Confirmation email has been sent.");
  }catch (error) {
  console.error("Booking error:", error.response?.data);
  toast.error(error.response?.data?.message || "Failed to book event");
}

};


  if (loading)
    return (
      <p className="text-center text-purple-200 mt-10 text-lg animate-pulse">
        Loading event details...
      </p>
    );

  if (!event)
    return (
      <p className="text-center text-red-300 mt-10 text-lg">
        Event not found.
      </p>
    );

  const eventDate = new Date(event.date);
 const isPastEvent = eventDate < new Date();


 return (
    <div className="min-h-screen bg-linear-to-b from-[#1A0028] to-[#12001A] text-white pb-20">

      {/* HERO IMAGE */}
      <div className="relative w-full h-[350px] md:h-[450px]">
        <Image
          src={event.posterImage}
          alt="Event Poster"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-center px-4">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">

        {/* TAGLINE */}
        <p className="mt-6 text-lg italic text-purple-300 text-center">
          “Step into an unforgettable experience — where creativity meets celebration!”
        </p>

        {/* ORGANIZER SECTION */}
        <div className="mt-10 bg-white/10 p-5 rounded-xl border border-white/20 shadow-lg">
          <p className="text-xl font-semibold">
            Organized by: <span className="text-purple-300">{event.organizer.name}</span>
          </p>
          <p className="text-md flex items-center gap-2 text-gray-300 mt-1">
            <Mail size={17} /> {event.organizer.email}
          </p>
        </div>

        {/* DETAILS */}
        <div className="mt-10 space-y-6">

          <div className="bg-white/10 p-5 rounded-xl border border-white/20 shadow-lg">
            <h2 className="text-xl font-bold mb-2">About the Event</h2>
            <p className="text-gray-300 leading-7">{event.description}</p>
          </div>

          {/* EVENT INFO */}
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white/10 p-5 rounded-xl border border-white/20 shadow-lg">
              <h3 className="font-semibold text-purple-300 mb-3">Event Details</h3>
              <p className="flex items-center gap-2"><MapPin size={18}/> {event.location}</p>
              <p className="flex items-center gap-2 mt-2"><Calendar size={18}/> {new Date(event.date).toLocaleDateString()}</p>
              <p className="flex items-center gap-2 mt-2"><Users size={18}/> t\Total tickets: {event.capacity}</p>
              <p className="flex items-center gap-2 mt-2"><Users size={18}/> Available: {event.capacity - event.currentAttendees}</p>
            </div>

            <div className="bg-white/10 p-5 rounded-xl border border-white/20 shadow-lg">
              <h3 className="font-semibold text-purple-300 mb-3">Registration</h3>
              <p className="flex items-center gap-2">
                <IndianRupee size={18}/> Fee: {event.registrationFee}
              </p>
              <p className="text-sm text-gray-300 mt-1 italic">
               *Payment will be collected on the day of the event during on-spot registration.*</p>
              
            </div>

          </div>
        </div>

       {/* BUTTONS */}
    <div className="flex flex-col md:flex-row gap-5 mt-10 justify-center">
  
  {/* ENQUIRE BUTTON */}
  
<Link href="/attendee/events">
  <button className="
    px-8 py-3 rounded-2xl text-lg font-bold
    bg-purple-600 hover:bg-purple-700 transition-all shadow-lg
  ">
    Cancel
  </button>
  </Link>

  {/* BOOK BUTTON */}
  <button
    onClick={handleBooking}
    disabled={isPastEvent}
    className={`
      px-8 py-3 rounded-2xl text-lg font-bold transition-all shadow-lg
      ${isPastEvent 
        ? "bg-gray-600 cursor-not-allowed opacity-60" 
        : "bg-green-500 hover:bg-green-600"}
    `}
  >
    {isPastEvent ? "Event Ended" : "Book Event →"}
  </button>

</div>


      </div>
      
    </div>
  );
}
