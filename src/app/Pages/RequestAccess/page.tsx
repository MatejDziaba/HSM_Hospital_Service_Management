"use client";

import { useState } from "react";

export default function PristupPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Odosielam...");

    try {
      const res = await fetch("/api/sendAccessRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, message }),
      });

      if (res.ok) {
        setStatus("Žiadosť bola úspešne odoslaná.");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setStatus("Nepodarilo sa odoslať žiadosť, skúste znova.");
      }
    } catch (err) {
      setStatus("Nepodarilo sa odoslať žiadosť, skúste znova.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Požiadajte o prístup
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Váš email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Telefónne číslo"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Vaša správa"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
          >
            Odoslať žiadosť
          </button>
        </form>
        {status && (
          <p className="text-center mt-4 text-sm text-gray-600">{status}</p>
        )}
      </div>
    </div>
  );
}
