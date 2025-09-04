'use client';
import React, { useState } from "react";
import { IPacient } from "@/app/Interfaces";

interface PacientADDProps {
  onClose: () => void;
  onSave: (pacient: IPacient) => void;
  errorRC: string;
}

export default function PacientADD({ onClose, onSave, errorRC }: PacientADDProps) {
  const [meno, setMeno] = useState("");
  const [priezvisko, setPriezvisko] = useState("");
  const [rodneCislo, setRodneCislo] = useState("");
  const [oddelenie, setOddelenie] = useState("");
  const [cisloIzby] = useState("");

  // automatické vloženie "/" po 6 znaku
  const handleRodneCisloChange = (value: string) => {
    let clean = value.replace(/\D/g, ""); // iba čísla
    if (clean.length > 6) {
      clean = clean.slice(0, 6) + "/" + clean.slice(6);
    }
    setRodneCislo(clean);
  };

  const handleSave = () => {
    const novyPacient: IPacient = {
      id: Date.now(),
      meno,
      priezvisko,
      rodneCislo,
      oddelenie,
      medicines: [],
      events: [],
      pobyt: [{
        id: Date.now(),
        cisloIzby,
        zaciatok: new Date().toISOString().split("T")[0],
        ukoncene: ""
      }]
    };
    onSave(novyPacient);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
        <h3 className="text-xl font-semibold mb-4">Pridať pacienta</h3>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Meno"
            value={meno}
            onChange={e => setMeno(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Priezvisko"
            value={priezvisko}
            onChange={e => setPriezvisko(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          
          <div className="text-left">
            <input
              type="text"
              placeholder="Rodné číslo"
              value={rodneCislo}
              onChange={e => handleRodneCisloChange(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              maxLength={11} // napr. 000000/0000
            />
            <small className="text-gray-500 text-center">
              RC píšte bez <b>/</b>
            </small>
            {errorRC && <p className="text-red-500 text-sm">{errorRC}</p>}
          </div>

          <select
            value={oddelenie}
            onChange={e => setOddelenie(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">-- Vyber oddelenie --</option>
            <option value="Chirurgia">Chirurgia</option>
            <option value="Interné">Interné</option>
            <option value="Ortopédia">Ortopédia</option>
            <option value="Neurológia">Neurológia</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Zrušiť
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Uložiť
          </button>
        </div>
      </div>
    </div>
  );
}
