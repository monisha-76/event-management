"use client";

import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function AttendeeLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-linear-to-br from-[#1a0826] via-[#2a0c37] to-[#11001a] text-white relative">

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 
        bg-black/30 backdrop-blur-xl border-r border-purple-900/40
        shadow-2xl transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-purple-900/40">
          <h1 className="text-xl font-semibold tracking-wide">Attendee</h1>
          <X
            onClick={() => setOpen(false)}
            className="cursor-pointer hover:text-purple-300"
          />
        </div>

        <nav className="mt-6 space-y-5 p-5 text-lg">
          <Link
            href="/attendee"
            onClick={() => setOpen(false)}
            className="block hover:text-purple-300"
          >
            Home
          </Link>

          <Link
            href="/attendee/events"
            onClick={() => setOpen(false)}
            className="block hover:text-purple-300"
          >
            All Events
          </Link>

          <Link
            href="/attendee/profile"
            onClick={() => setOpen(false)}
            className="block hover:text-purple-300"
          >
            My Profile
          </Link>

          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block hover:text-red-400 pt-4"
          >
            Logout
          </Link>
        </nav>
      </aside>

      {/* Menu Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="p-3 rounded-xl bg-black/40 hover:bg-black/30 
          fixed top-5 left-5 z-50 border border-purple-800 shadow-xl"
        >
          <Menu size={26} />
        </button>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-10 transition-all">
        {children}
      </main>
    </div>
  );
}
