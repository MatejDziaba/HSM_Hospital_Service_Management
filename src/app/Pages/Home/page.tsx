// pages/index.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!username || !password) {
      alert("Vyplňte meno a heslo!");
      return;
    }

    // presmerovanie bez alertu
    router.push("/Pages/Lekar");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/home1.jpg')",
      }}
    >
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
          HMS - Hospital Management Service
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Meno používateľa:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Heslo:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Prihlásiť sa
        </button>

        {/* Hint text */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          Ak ešte nie ste v systéme, požiadajte o{" "}
          <Link
            href="/Pages/RequestAccess"
            className="text-blue-600 underline hover:text-blue-800"
          >
            prístup
          </Link>.
        </p>
      </div>
    </div>
  );
}
