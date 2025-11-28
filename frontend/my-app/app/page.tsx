"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#0a0118] via-[#10041f] to-[#1a0728] flex flex-col items-center justify-center text-white relative overflow-hidden">

      {/* Magical glowing orbs */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-52 h-52 bg-blue-600/20 rounded-full blur-3xl animate-ping"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl animate-spin-slow"></div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-fuchsia-500 to-indigo-400 drop-shadow-2xl text-center"
      >
        ✨ EventSphere ✨
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl text-center"
      >
        A magical world where events come alive. Discover programs, manage attendees, 
        and book your perfect experience — all in one beautifully crafted fantasy platform.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="flex gap-6 mt-10"
      >
        <Link href="/auth">
          <button className="px-8 py-3 rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 text-lg font-semibold shadow-xl hover:shadow-fuchsia-500/40 transition-all hover:scale-105">
            Login
          </button>
        </Link>

        <Link href="/auth">
          <button className="px-8 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-lg font-semibold shadow-xl hover:shadow-purple-500/40 transition-all hover:scale-105">
            Register
          </button>
        </Link>
      </motion.div>

      {/* Footer */}
      <p className="absolute bottom-6 text-gray-400 text-sm">
        Crafted with ❤️ using Next.js + TailwindCSS
      </p>
    </div>
  );
}
