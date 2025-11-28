"use client";

import { useState } from "react";
import toast from "react-hot-toast";


export default function AuthPage() {
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [role, setRole] = useState("attendee");

  const backendURL = "http://localhost:5000";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${backendURL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return toast.error(data.message || "Login failed");
      }

      toast.success("Login successful!");

      const role = data.user.role;

      if (role === "admin") {
        window.location.href = "/admin";
      } else if (role === "organizer") {
        window.location.href = "/organizer";
      } else {
        window.location.href = "/attendee";
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${backendURL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: registerEmail,
          password: registerPassword,
          role,
        }),
      });

      const data = await res.json();
      toast.success(data.message);

      console.log("Register Response:", data);
    } catch (err) {
      console.log(err);
      toast.error("Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: 'url(/event.png)' }}
    >
      <div className="flex flex-col md:flex-row gap-40 w-full max-w-5xl justify-center items-start">

        {/* LOGIN FORM */}
        <div className="w-full max-w-xs">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>

          <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white text-black shadow-md focus:ring-purple-500 focus:border-purple-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-white text-black shadow-md focus:ring-purple-500 focus:border-purple-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg transition"
            >
              Login
            </button>
          </form>
        </div>

        {/* REGISTER FORM */}
        <div className="w-full max-w-xs">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Register</h2>

          <form className="flex flex-col space-y-4" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white text-black shadow-md focus:ring-purple-500 focus:border-purple-500"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-white text-black shadow-md focus:ring-purple-500 focus:border-purple-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-white text-black shadow-md focus:ring-purple-500 focus:border-purple-500"
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 rounded-xl bg-white text-black shadow-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="attendee">Attendee</option>
              <option value="organizer">Organizer</option>
            </select>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg transition"
            >
              Register
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
