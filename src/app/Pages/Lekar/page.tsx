'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaSyringe, FaRunning, FaPills } from "react-icons/fa";
import Image from "next/image";

import Lieky from "../../Components/ui/CRUD/lieky";
import Pacienti from "@/app/Components/ui/CRUD/pacient/pacient";
import Podanie from "@/app/Components/ui/CRUD/podanie";
import PodanieBez from "@/app/Components/ui/CRUD/podanieBez";
import Aktivity from "@/app/Components/ui/CRUD/aktivita/aktivita";

export default function Lekar() {
  const text = "Vitajte, Doc. MUDr. Jozef Gurdy";
  const [displayedText, setDisplayedText] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Mock dáta
  const hospitalName = "Univerzitná nemocnica Bratislava";
  const departmentName = "Interné oddelenie";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index === text.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-32 px-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* Hlavný nadpis s typewriter animáciou */}
      <motion.h1
        className="text-4xl font-extrabold mb-8 text-gray-900 text-center tracking-tight"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {displayedText}
        <span className="animate-pulse">|</span>
      </motion.h1>
      {/* Hlavička s logom a nemocnicou */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-2xl font-bold text-gray-900 text-center">{hospitalName}</h2>
        <p className="text-gray-600 text-center">{departmentName}</p>
      </div>

      

      {/* Akčný navbar */}
      <div className="flex justify-center gap-6 mb-16 flex-wrap">
        <button
          onClick={() => setActiveSection("pacienti")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow transition font-medium 
            ${activeSection === "pacienti" ? "bg-blue-700 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
        >
          <FaUserPlus /> Pridať pacienta
        </button>
        <button
          onClick={() => setActiveSection("podanie")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow transition font-medium 
            ${activeSection === "podanie" ? "bg-green-700 text-white" : "bg-green-600 text-white hover:bg-green-700"}`}
        >
          <FaSyringe /> Pridať podanie pacientovi
        </button>
        <button
          onClick={() => setActiveSection("aktivity")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow transition font-medium 
            ${activeSection === "aktivity" ? "bg-purple-700 text-white" : "bg-purple-600 text-white hover:bg-purple-700"}`}
        >
          <FaRunning /> Pridať aktivity pacientovi
        </button>
        <button
          onClick={() => setActiveSection("lieky")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow transition font-medium 
            ${activeSection === "lieky" ? "bg-pink-700 text-white" : "bg-pink-600 text-white hover:bg-pink-700"}`}
        >
          <FaPills /> Pridať lieky do systému
        </button>
      </div>

      {/* Obsah – zobrazuje sa iba vybraná sekcia */}
      <div className="max-w-7xl mx-auto space-y-8">
        {!activeSection && (
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              Prosím, zvoľte si akciu, ktorú chcete vykonať
            </h2>
            <p className="text-gray-500 text-center">
              Vyberte jednu z možností vyššie, aby ste mohli pokračovať.
            </p>
            <Image
              src="/logo.png"
              alt="Logo nemocnice"
              width={80}
              height={80}
              className="mb-3 mx-auto"
            />
          </motion.div>
        )}

        {activeSection === "pacienti" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-left" style={{ paddingTop: "0px", paddingBottom: "0px" }}>
            <Pacienti />
          </div>
        )}

        {activeSection === "podanie" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-28 space-y-8 text-left" style={{ paddingTop: "0px", paddingBottom: "0px" }}>
            <PodanieBez />
            <Podanie />
          </div>
        )}

        {activeSection === "aktivity" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-left" style={{ paddingTop: "0px", paddingBottom: "0px" }}>
            <Aktivity />
          </div>
        )}

        {activeSection === "lieky" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-left" style={{ paddingTop: "24px", paddingBottom: "0px" }}>
            <Lieky />
          </div>
        )}
      </div>
    </div>
  );
}
