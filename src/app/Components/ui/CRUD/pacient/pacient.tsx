'use client';
import { IPacient } from "@/app/Interfaces";
import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import PacientADD from "./pacientADD";
import PacientUPDATE from "./pacientUPDATE";
import PacientDELETE from "./pacientDELETE";
import { normalizeText, validateRodneCislo } from "@/app/utils/page";

export default function PacientiComponent() {
  const [pacienti, setPacienti] = useState<IPacient[]>([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [aktualnyPacient, setAktualnyPacient] = useState<IPacient | null>(null);
  const [pacientNaVymazanie, setPacientNaVymazanie] = useState<IPacient | null>(null);
  const [errorRC, setErrorRC] = useState<string>("");

  useEffect(() => {
    // Mock dáta
    setPacienti([
      {
        id: 1, meno: "Jozef", priezvisko: "Novák", oddelenie: "Chirurgia", rodneCislo: "800101/1234",
        medicines: [], events: [],
        pobyt: [{ id: 1, cisloIzby: "101", zaciatok: "2023-01-01", ukoncene: "" }]
      },
      {
        id: 2, meno: "Anna", priezvisko: "Kováčová", oddelenie: "Interné", rodneCislo: "755212/5678",
        medicines: [], events: [],
        pobyt: [{ id: 2, cisloIzby: "202", zaciatok: "2023-01-05", ukoncene: "" }]
      }
    ]);
  }, []);

 const filtrovaniPacienti = pacienti.filter(p => {
  const poslednePodanie = p.pobyt.length > 0 ? p.pobyt[p.pobyt.length - 1].cisloIzby : "";
  const text = `${p.meno} ${p.priezvisko} ${p.rodneCislo} ${poslednePodanie} ${p.oddelenie}`;
  return normalizeText(text).includes(normalizeText(search));
});

  const handlePridatPacienta = (pacient: IPacient) => {
    if (!validateRodneCislo(pacient.rodneCislo)) {
      setErrorRC("Neplatné rodné číslo!");
      return;
    }
    setErrorRC("");

    setPacienti(prev => [
      ...prev,
      {
        ...pacient,
        id: prev.length + 1,
        medicines: pacient.medicines ?? [],
        events: pacient.events ?? [],
        pobyt: pacient.pobyt ?? []
      }
    ]);
    setShowAddModal(false);
  };

const handleUpravitPacienta = (upraveny: IPacient) => {
  if (!validateRodneCislo(upraveny.rodneCislo)) {
    setErrorRC("Neplatné rodné číslo!");
    return;
  }
  setErrorRC("");

  setPacienti(prev => prev.map(p => p.id === upraveny.id ? upraveny : p));
  setShowEditModal(false);
  setAktualnyPacient(null);
};



  const handleVymazatPacienta = () => {
    if (!pacientNaVymazanie) return;
    setPacienti(prev => prev.filter(p => p.id !== pacientNaVymazanie.id));
    setShowDeleteModal(false);
    setPacientNaVymazanie(null);
    setShowEditModal(false);
  };

  return (
    <section className="mb-10 mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 flex-1">Pacienti</h2>
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Hľadaj pacienta..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 shadow"
        >
          <FaPlus /> Pridať pacienta
        </button>
      </div>

      {/* TABUĽKA */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Meno</th>
              <th className="px-4 py-2 text-left">Priezvisko</th>
              <th className="px-4 py-2 text-left">Rodné číslo</th>
              <th className="px-4 py-2 text-left">Oddelenie</th>
              <th className="px-4 py-2 text-center">Akcie</th>
            </tr>
          </thead>
          <tbody>
            {filtrovaniPacienti.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{p.meno}</td>
                <td className="px-4 py-2">{p.priezvisko}</td>
                <td className="px-4 py-2">{p.rodneCislo}</td>
                <td className="px-4 py-2">{p.oddelenie}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => { setAktualnyPacient(p); setShowEditModal(true); }}
                      className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 shadow"
                    >
                      <FaEdit className="text-green-600" /> Upraviť
                    </button>
                    <button
                      onClick={() => { setPacientNaVymazanie(p); setShowDeleteModal(true); }}
                      className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 shadow"
                    >
                      <FaTrash className="text-red-600" /> Vymazať
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtrovaniPacienti.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  Žiadni pacienti pre toto vyhľadávanie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <PacientADD
          onClose={() => setShowAddModal(false)}
          onSave={handlePridatPacienta}
          errorRC={errorRC}
        />
      )}

      {showEditModal && aktualnyPacient && (
        <PacientUPDATE
          pacient={aktualnyPacient}
          onClose={() => { setShowEditModal(false); setAktualnyPacient(null); }}
          onSave={handleUpravitPacienta}
          errorRC={errorRC}
        />
      )}

      {showDeleteModal && pacientNaVymazanie && (
        <PacientDELETE
          pacient={pacientNaVymazanie}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleVymazatPacienta}
        />
      )}
    </section>
  );
}
