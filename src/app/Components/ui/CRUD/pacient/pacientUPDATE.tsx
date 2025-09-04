'use client';
import { IPacient } from "@/app/Interfaces";
import React, { useState } from "react";

interface Props {
  pacient: IPacient;
  onClose: () => void;
  onSave: (pacient: IPacient) => void;
  errorRC: string;
}

export default function PacientUPDATE({ pacient, onClose, onSave, errorRC }: Props) {
  const [upravenyPacient, setUpravenyPacient] = useState<IPacient>({ ...pacient });

  // spracovanie rodného čísla: povolí zadanie s / aj bez /
  const handleRodneCisloChange = (value: string) => {
    let clean = value.replace(/\D/g, ""); // odstráň všetko okrem číslic
    if (clean.length > 6) {
      clean = clean.slice(0, 6) + "/" + clean.slice(6);
    }
    setUpravenyPacient({ ...upravenyPacient, rodneCislo: clean });
  };

  const handleSave = () => {
    onSave(upravenyPacient); // pošle upraveného pacienta rodičovi
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
        <h3 className="text-xl font-semibold mb-4">Upraviť pacienta</h3>

        {/* Meno */}
        <input
          type="text"
          placeholder="Meno"
          value={upravenyPacient.meno}
          onChange={e => setUpravenyPacient({ ...upravenyPacient, meno: e.target.value })}
          className="w-full border px-3 py-2 rounded-lg mb-3"
        />

        {/* Priezvisko */}
        <input
          type="text"
          placeholder="Priezvisko"
          value={upravenyPacient.priezvisko}
          onChange={e => setUpravenyPacient({ ...upravenyPacient, priezvisko: e.target.value })}
          className="w-full border px-3 py-2 rounded-lg mb-3"
        />

        {/* Rodné číslo */}
        <div className="text-left mb-3">
          <input
            type="text"
            placeholder="Rodné číslo"
            value={upravenyPacient.rodneCislo}
            onChange={e => handleRodneCisloChange(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg mb-1"
            maxLength={11}
          />
          <small className="text-gray-500">
            Rodné číslo môžete napísať aj bez <b>/</b>, doplní sa automaticky.
          </small>
          {errorRC && <p className="text-red-500 text-sm mt-1">{errorRC}</p>}
        </div>

        {/* Oddelenie */}
        <select
          value={upravenyPacient.oddelenie}
          onChange={e => setUpravenyPacient({ ...upravenyPacient, oddelenie: e.target.value })}
          className="w-full border px-3 py-2 rounded-lg mb-4"
        >
          <option value="">Vyber oddelenie</option>
          <option value="Chirurgia">Chirurgia</option>
          <option value="Interné">Interné</option>
          <option value="Ortopédia">Ortopédia</option>
          <option value="Pediatria">Pediatria</option>
        </select>

        {/* Tlačidlá */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Zrušiť
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Uložiť zmeny
          </button>
        </div>
      </div>
    </div>
  );
}
