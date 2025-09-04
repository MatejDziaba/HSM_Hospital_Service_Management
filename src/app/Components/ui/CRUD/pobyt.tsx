'use client';
import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import { IPacient, IPobyt } from "../../../Interfaces";

export default function PodanieComponent() {
  const [pacienti, setPacienti] = useState<IPacient[]>([]);

  // UI state
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit/Delete state
  const [aktualnyPobyt, setAktualnyPobyt] = useState<IPobyt | null>(null);
  const [aktualnyPobytPacientId, setAktualnyPobytPacientId] = useState<number | null>(null);
  const [editTargetPacientId, setEditTargetPacientId] = useState<number | null>(null);

  const [pobytNaVymazanie, setPobytNaVymazanie] = useState<IPobyt | null>(null);
  const [pobytNaVymazaniePacientId, setPobytNaVymazaniePacientId] = useState<number | null>(null);

  const [showCompleted, setShowCompleted] = useState(false); 

  useEffect(() => {
    // Mock dáta
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
          { id: 1, cisloIzby: "101", zaciatok: "2025-08-26T14:00", ukoncene: "" }
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
          { id: 2, cisloIzby: "102", zaciatok: "2025-08-24T14:00", ukoncene: "2025-08-26T14:00" },
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
      }
    ]);
  }, []);

  const normalizeText = (text: string) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Rozbalený pohľad: každé podanie + údaje o pacientovi
  const allRows = useMemo(() => {
    return pacienti.flatMap((pacient) =>
      pacient.pobyt.map((pd) => ({
        id: pd.id,
        cisloIzby: pd.cisloIzby,
        zaciatok: pd.zaciatok,
        ukoncene: pd.ukoncene,
        pacientId: pacient.id,
        meno: pacient.meno,
        priezvisko: pacient.priezvisko,
        oddelenie: pacient.oddelenie,
        rowKey: `${pacient.id}-${pd.id}`,
      }))
    );
  }, [pacienti]);

  const filtrovanePodania = useMemo(() => {
    const q = normalizeText(search);
    return allRows.filter((r) => {
      const isCompleted = r.ukoncene !== "";
      if (!showCompleted && isCompleted) return false;
      const text = `${r.meno} ${r.priezvisko} ${r.oddelenie} ${r.cisloIzby} ${r.zaciatok} ${r.ukoncene}`;
      return normalizeText(text).includes(q);
    });
  }, [allRows, search, showCompleted]);

  // ÚPRAVA
  const handleUpravitPodanie = () => {
    if (!aktualnyPobyt || !aktualnyPobytPacientId || !editTargetPacientId) return;

    const isSamePatient = aktualnyPobytPacientId === editTargetPacientId;

    setPacienti((prev) => {
      let out = prev.map((p) => ({ ...p }));

      if (isSamePatient) {
        out = out.map((p) =>
          p.id === aktualnyPobytPacientId
            ? {
                ...p,
                pobyt: p.pobyt.map((pd) => (pd.id === aktualnyPobyt.id ? aktualnyPobyt : pd)),
              }
            : p
        );
      } else {
        out = out.map((p) => {
          if (p.id === aktualnyPobytPacientId) {
            return { ...p, pobyt: p.pobyt.filter((pd) => pd.id !== aktualnyPobyt.id) };
          }
          if (p.id === editTargetPacientId) {
            return { ...p, pobyt: [...p.pobyt, aktualnyPobyt] };
          }
          return p;
        });
      }
      return out;
    });

    // Reset
    setShowEditModal(false);
    setAktualnyPobyt(null);
    setAktualnyPobytPacientId(null);
    setEditTargetPacientId(null);
  };

  // VYMAZANIE
  const handleVymazatPodanie = () => {
    if (!pobytNaVymazanie || !pobytNaVymazaniePacientId) return;

    setPacienti((prev) =>
      prev.map((p) =>
        p.id === pobytNaVymazaniePacientId
          ? { ...p, pobyt: p.pobyt.filter((pd) => pd.id !== pobytNaVymazanie.id) }
          : p
      )
    );

    // Reset
    setShowDeleteModal(false);
    setPobytNaVymazanie(null);
    setPobytNaVymazaniePacientId(null);
  };

  // pomocná funkcia na formátovanie
  const formatDateTime = (value: string) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;

  return `${d.toLocaleDateString("sk-SK")} ${d.toLocaleTimeString("sk-SK", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};


  return (
    <section className="mb-10 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 flex-1">Pacienti s pobytom</h2>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
            className="w-4 h-4"
          />
          Zobraziť ukončené
        </label>
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Hľadaj pobyt/pacienta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>
      {/* Tabuľka */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">Pacient</th>
              <th className="px-4 py-2 border-b text-left">Oddelenie</th>
              <th className="px-4 py-2 border-b text-left">Číslo izby</th>
              <th className="px-4 py-2 border-b text-left">Začiatok</th>
              <th className="px-4 py-2 border-b text-left">Ukončené</th>
              <th className="px-4 py-2 border-b text-left">Akcie</th>
            </tr>
          </thead>
          <tbody>
            {filtrovanePodania.map((r) => (
              <tr key={r.rowKey} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{r.meno} {r.priezvisko}</td>
                <td className="px-4 py-2 border-b">{r.oddelenie}</td>
                <td className="px-4 py-2 border-b">{r.cisloIzby}</td>
                <td className="px-4 py-2 border-b">{formatDateTime(r.zaciatok)}</td>
                <td className="px-4 py-2 border-b">{formatDateTime(r.ukoncene)}</td>
                <td className="px-4 py-2 border-b flex gap-2">
                  <button
                    onClick={() => {
                      const pd: IPobyt = {
                        id: r.id,
                        cisloIzby: r.cisloIzby,
                        zaciatok: r.zaciatok,
                        ukoncene: r.ukoncene ? r.ukoncene : "",
                      };
                      setAktualnyPobyt(pd);
                      setAktualnyPobytPacientId(r.pacientId);
                      setEditTargetPacientId(r.pacientId);
                      setShowEditModal(true);
                    }}
                    className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 shadow"
                  >
                    <FaEdit className="text-green-500" /> Upraviť
                  </button>
                  <button
                    onClick={() => {
                      setPobytNaVymazanie({
                        id: r.id,
                        cisloIzby: r.cisloIzby,
                        zaciatok: r.zaciatok,
                        ukoncene: r.ukoncene,
                      });
                      setPobytNaVymazaniePacientId(r.pacientId);
                      setShowDeleteModal(true);
                    }}
                    className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 shadow"
                  >
                    <FaTrash className="text-red-500" /> Vymazať
                  </button>
                </td>
              </tr>
            ))}
            {filtrovanePodania.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  Žiadne podania pre toto vyhľadávanie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && aktualnyPobyt && aktualnyPobytPacientId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Upraviť podanie</h3>

            <label className="block text-sm mb-1">Pacient</label>
            <select
              value={editTargetPacientId ?? ""}
              onChange={(e) => setEditTargetPacientId(parseInt(e.target.value, 10))}
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
              value={aktualnyPobyt.cisloIzby}
              onChange={(e) => setAktualnyPobyt({ ...aktualnyPobyt, cisloIzby: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />

            <label className="block text-sm mb-1">Začiatok</label>
            <input
              type="datetime-local"
              value={aktualnyPobyt.zaciatok}
              onChange={(e) => setAktualnyPobyt({ ...aktualnyPobyt, zaciatok: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />

            <label className="block text-sm mb-1">Ukončené</label>
            <input
              type="datetime-local"
              value={aktualnyPobyt.ukoncene ?? ""}
              onChange={(e) => setAktualnyPobyt({ ...aktualnyPobyt, ukoncene: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-6"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setAktualnyPobyt(null);
                  setAktualnyPobytPacientId(null);
                  setEditTargetPacientId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Zrušiť
              </button>
              <button
                onClick={handleUpravitPodanie}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Uložiť
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && pobytNaVymazanie && pobytNaVymazaniePacientId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h3 className="text-xl font-semibold mb-4">Naozaj vymazať podanie?</h3>
            <p className="mb-4">
              {(() => {
                const pac = pacienti.find((p) => p.id === pobytNaVymazaniePacientId);
                return (
                  <>
                    {pac?.meno} {pac?.priezvisko} — izba {pobytNaVymazanie.cisloIzby}
                    <br />
                    Začiatok: {pobytNaVymazanie.zaciatok} • Ukončené: {pobytNaVymazanie.ukoncene}
                  </>
                );
              })()}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPobytNaVymazanie(null);
                  setPobytNaVymazaniePacientId(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Zrušiť
              </button>
              <button
                onClick={handleVymazatPodanie}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Vymazať
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
