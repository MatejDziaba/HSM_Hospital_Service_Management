'use client';
import { IPacient } from "@/app/Interfaces";
import React from "react";

interface Props {
  pacient: IPacient;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PacientDELETE({ pacient, onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
        <h3 className="text-xl font-semibold mb-4">Vymazať pacienta</h3>
        <p>Si si istý, že chceš vymazať pacienta <strong>{pacient.meno} {pacient.priezvisko}</strong>?</p>
        
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            Vymazať
          </button>
        </div>
      </div>
    </div>
  );
}
