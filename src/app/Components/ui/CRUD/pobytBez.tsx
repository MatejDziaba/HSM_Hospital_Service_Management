'use client';

import React, { useEffect, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { IPacient, IPobyt } from "../../../Interfaces";

export default function BezPobytu() {
  const [pacienti, setPacienti] = useState<IPacient[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPacientIdForAdd, setSelectedPacientIdForAdd] = useState<number | "">("");
  const [novyPodanie, setNovyPodanie] = useState<Partial<IPobyt>>({});

  // Mock dáta (rovnaké ako v PodanieComponent)
  useEffect(() => {
    setPacienti([
      {
        id: 1,
        meno: "Jozef",
        priezvisko: "Novák",
        rodneCislo: "800101/1234",
        oddelenie: "Chirurgia",
        medicines: [],
        events: [],
        pobyt: [
          {
            id: 1,
            cisloIzby: "101",
            zaciatok: "2025-08-26T14:00",
            ukoncene: "",
          },
        ],
      },
      {
        id: 2,
        meno: "Anna",
        priezvisko: "Kováčová",
        rodneCislo: "755212/5678",
        oddelenie: "Interné",
        medicines: [],
        events: [],
        pobyt: [
          {
            id: 2,
            cisloIzby: "102",
            zaciatok: "2025-08-24T14:00",
            ukoncene: "2025-08-26T14:00",
          },
        ],
      },
      {
        id: 3,
        meno: "Matej",
        priezvisko: "Kováč",
        rodneCislo: "755212/5678",
        oddelenie: "Interné",
        medicines: [],
        events: [],
        pobyt: [],
      },
    ]);
  }, []);

  // pomocné
  const pacientiBezPobytu = useMemo(() => {
    return pacienti.filter((p) => !p.pobyt || p.pobyt.length === 0);
  }, [pacienti]);

  const nextGlobalPodanieId = () => {
    const ids = pacienti.flatMap((p) => p.pobyt.map((pd) => pd.id));
    return (ids.length ? Math.max(...ids) : 0) + 1;
  };

  // pridanie nového pobytu
  const handlePridatPodanie = () => {
    if (!selectedPacientIdForAdd || !novyPodanie.cisloIzby || !novyPodanie.zaciatok) return;
    const newId = nextGlobalPodanieId();
    const nove: IPobyt = {
      id: newId,
      cisloIzby: novyPodanie.cisloIzby!,
      zaciatok: novyPodanie.zaciatok!,
      ukoncene: novyPodanie.ukoncene ?? "",
    };
    setPacienti((prev) =>
      prev.map((p) =>
        p.id === selectedPacientIdForAdd ? { ...p, pobyt: [...p.pobyt, nove] } : p
      )
    );
    setShowAddModal(false);
    setNovyPodanie({});
    setSelectedPacientIdForAdd("");
  };

  return (
    <section className="mb-10 mt-6">
      {pacientiBezPobytu.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold p-4">Pacienti bez pobytu</h3>
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left">Meno</th>
                <th className="px-4 py-2 border-b text-left">Priezvisko</th>
                <th className="px-4 py-2 border-b text-left">Oddelenie</th>
                <th className="px-4 py-2 border-b text-left">Akcie</th>
              </tr>
            </thead>
            <tbody>
              {pacientiBezPobytu.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{p.meno}</td>
                  <td className="px-4 py-2 border-b">{p.priezvisko}</td>
                  <td className="px-4 py-2 border-b">{p.oddelenie}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => {
                        setShowAddModal(true);
                        setSelectedPacientIdForAdd(p.id);
                      }}
                      className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 shadow"
                    >
                      <FaPlus /> Pridať pobyt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Pridať pobyt</h3>
            <label className="block text-sm mb-1">Pacient</label>
            <select
              value={selectedPacientIdForAdd}
              onChange={(e) =>
                setSelectedPacientIdForAdd(e.target.value ? parseInt(e.target.value, 10) : "")
              }
              className="w-full border px-3 py-2 rounded-lg mb-4"
            >
              {pacienti.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.meno} {p.priezvisko} — {p.oddelenie}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">Číslo izby</label>
            <input
              type="text"
              placeholder="Číslo izby"
              value={novyPodanie.cisloIzby ?? ""}
              onChange={(e) => setNovyPodanie({ ...novyPodanie, cisloIzby: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />

            <label className="block text-sm mb-1">Začiatok</label>
            <input
              type="datetime-local"
              value={novyPodanie.zaciatok ?? ""}
              onChange={(e) => setNovyPodanie({ ...novyPodanie, zaciatok: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />

            <label className="block text-sm mb-1">Koniec (nechaj prázdne ak prebieha)</label>
            <input
              type="datetime-local"
              value={novyPodanie.ukoncene ?? ""}
              onChange={(e) => setNovyPodanie({ ...novyPodanie, ukoncene: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-6"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNovyPodanie({});
                  setSelectedPacientIdForAdd("");
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Zrušiť
              </button>
              <button
                onClick={handlePridatPodanie}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Uložiť
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
