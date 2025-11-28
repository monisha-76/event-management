"use client";
import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function OrganizerLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white relative">

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 
        bg-gray-800/90 backdrop-blur-xl border-r border-gray-700 
        shadow-2xl transition-transform duration-300 z-40 
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <h1 className="text-xl font-semibold tracking-wide">Organizer</h1>
          <X
            onClick={() => setOpen(false)}
            className="cursor-pointer hover:text-gray-300"
          />
        </div>

       <nav className="mt-6 space-y-5 p-5 text-lg">
  <Link href="/organizer" onClick={() => setOpen(false)} className="block hover:text-purple-300">Home</Link>

  <Link href="/organizer/create" onClick={() => setOpen(false)} className="block hover:text-purple-300">
    Create Event
  </Link>

  <Link href="/organizer/overview" onClick={() => setOpen(false)} className="block hover:text-purple-300">
    Overview
  </Link>

  <Link href="/organizer/account" onClick={() => setOpen(false)} className="block hover:text-purple-300">
    My Account
  </Link>

  <Link href="/" onClick={() => setOpen(false)} className="block hover:text-red-400 pt-4">Logout</Link>
</nav>
      </aside>

      {/* MENU BUTTON – hidden when sidebar open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="p-3 rounded-xl bg-gray-800/90 hover:bg-gray-700 
          fixed top-5 left-5 z-50 border border-gray-600 shadow-xl"
        >
          <Menu size={26} />
        </button>
      )}

      {/* MAIN AREA */}
      <main className="flex-1 p-8 md:p-10 transition-all">
        {children}
      </main>
    </div>
  );
}
