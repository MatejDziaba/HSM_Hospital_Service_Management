'use client';
import { IOddelenie } from "@/app/Interfaces";
import React, { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

export default function Oddelenia() {
  const [oddelenia, setOddelenia] = useState<IOddelenie[]>([]);
  const [searchOddelenie, setSearchOddelenie] = useState("");
  const [editovaneOddelenie, setEditovaneOddelenie] = useState<IOddelenie | null>(null);
  const [oddelenieNaVymazanie, setOddelenieNaVymazanie] = useState<IOddelenie | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [novyOddelenieNazov, setNovyOddelenieNazov] = useState("");

  useEffect(() => {
    setOddelenia([
      { id: 1, nazov: "Chirurgia" },
      { id: 2, nazov: "Interna" },
      { id: 3, nazov: "Pediatria" },
    ]);
  }, []);

  const otvorVymazanie = (oddelenie: IOddelenie) => {
    setOddelenieNaVymazanie(oddelenie);
    setShowDeleteModal(true);
  };

  const handleVymazatOddelenie = () => {
    if (!oddelenieNaVymazanie) return;
    setOddelenia(prev => prev.filter(o => o.id !== oddelenieNaVymazanie.id));
    setShowDeleteModal(false);
    setOddelenieNaVymazanie(null);
    setEditovaneOddelenie(null);
  };

  const ulozUpdate = () => {
    if (!editovaneOddelenie) return;
    setOddelenia(prev =>
      prev.map(o =>
        o.id === editovaneOddelenie.id ? editovaneOddelenie : o
      )
    );
    setEditovaneOddelenie(null);
  };

  const handlePridatOddelenie = () => {
    if (!novyOddelenieNazov.trim()) return;
    setOddelenia(prev => [...prev, { id: prev.length + 1, nazov: novyOddelenieNazov }]);
    setNovyOddelenieNazov("");
    setShowAddModal(false);
  };

  // Funkcia na normalizáciu textu (odstránenie diakritiky a lowercase)
const normalizeText = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Filtrovanie oddelení podľa searchOddelenie
const filtrovaneOddelenia: IOddelenie[] = oddelenia.filter(o =>
  normalizeText(o.nazov).includes(normalizeText(searchOddelenie))
);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 flex-1">
          Oddelenia
        </h2>

        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Hľadaj oddelenie..."
            value={searchOddelenie}
            onChange={(e) => setSearchOddelenie(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 shadow"
        >
            <FaPlus /> Pridať oddelenie
        </button>
      </div>

      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Hľadaj oddelenie..."
          value={searchOddelenie}
          onChange={e => setSearchOddelenie(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
        />
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {filtrovaneOddelenia
          .map(o => (
            <div
              key={o.id}
              onClick={() => setEditovaneOddelenie(o)}
              className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col relative cursor-pointer"
            >
              <span className="text-lg font-medium">{o.nazov}</span>
              <span className="text-gray-500 text-sm mt-1">ID: {o.id}</span>
            </div>
          ))}
      </div>

      {/* Modal na pridanie oddelenia */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Pridať oddelenie</h3>
            <input
              type="text"
              placeholder="Názov oddelenia"
              value={novyOddelenieNazov}
              onChange={e => setNovyOddelenieNazov(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Zrušiť
              </button>
              <button
                onClick={handlePridatOddelenie}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Pridať
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal na editáciu */}
      {editovaneOddelenie && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Upraviť oddelenie</h3>

            <label className="block mb-2 text-gray-700">Názov oddelenia:</label>
            <input
              type="text"
              value={editovaneOddelenie.nazov}
              onChange={e => setEditovaneOddelenie({ ...editovaneOddelenie, nazov: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <div className="flex justify-between gap-2">
              <button
                onClick={() => setEditovaneOddelenie(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              >
                Zrušiť
              </button>
              <button
                onClick={ulozUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Uložiť
              </button>
              <button
                onClick={() => { if (editovaneOddelenie) otvorVymazanie(editovaneOddelenie); }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Vymazať
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal na potvrdenie vymazania */}
      {showDeleteModal && oddelenieNaVymazanie && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h3 className="text-xl font-semibold mb-4">Naozaj vymazať oddelenie?</h3>
            <p className="mb-4">{oddelenieNaVymazanie.nazov}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Zrušiť
              </button>
              <button
                onClick={handleVymazatOddelenie}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Vymazať
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
