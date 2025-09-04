'use client';
import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { IAktivita, IPacient } from "../../../../Interfaces/index";
import { normalizeText } from "@/app/utils/validation";

export default function AktivitaComponent() {
  const [pacienti, setPacienti] = useState<IPacient[]>([]);

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [novaAktivita, setNovaAktivita] = useState<Partial<IAktivita>>({});
  const [aktualnaAktivita, setAktualnaAktivita] = useState<IAktivita | null>(null);
  const [aktivitaNaVymazanie, setAktivitaNaVymazanie] = useState<{
    pacientId: number;
    aktivita: IAktivita;
  } | null>(null);

  const [vybranyPacientId, setVybranyPacientId] = useState<number | null>(null);

  useEffect(() => {
    // Mock pacientov so základnými dátami a aktivitami
    setPacienti([
      {
        id: 1,
        meno: "Jozef",
        priezvisko: "Novak",
        rodneCislo: "0009/6491",
        oddelenie: "Chirurgia",
        medicines: [],
        events: [
          { id: 1, nazovAktivity: "Rehabilitácia", casOpakovania: "30m" },
        ],
        pobyt: []
      },
      {
        id: 2,
        meno: "Anna",
        priezvisko: "Kovacova",
        rodneCislo: "0009/6492",
        oddelenie: "Interné",
        medicines: [],
        events: [
          { id: 2, nazovAktivity: "Ranné cvičenie", casOpakovania: "1h" },
        ],
        pobyt: []
      }
    ]);
  }, []);


  const filtrovaneAktivity = pacienti.flatMap(p =>
    p.events
      .filter(a =>
        normalizeText(`${a.nazovAktivity} ${p.meno} ${p.priezvisko}`).includes(
          normalizeText(search)
        )
      )
      .map(a => ({ ...a, pacient: p }))
  );

  const handlePridatAktivitu = () => {
    if (!novaAktivita.nazovAktivity || !novaAktivita.casOpakovania || !vybranyPacientId) return;

    setPacienti(prev =>
      prev.map(p =>
        p.id === vybranyPacientId
          ? {
              ...p,
              events: [
                ...p.events,
                {
                  id: Date.now(),
                  nazovAktivity: novaAktivita.nazovAktivity!,
                  casOpakovania: novaAktivita.casOpakovania!
                }
              ]
            }
          : p
      )
    );

    setShowAddModal(false);
    setNovaAktivita({});
    setVybranyPacientId(null);
  };

  const handleUpravitAktivitu = () => {
    if (!aktualnaAktivita || !vybranyPacientId) return;

    setPacienti(prev =>
      prev.map(p =>
        p.id === vybranyPacientId
          ? {
              ...p,
              events: p.events.map(a =>
                a.id === aktualnaAktivita.id ? aktualnaAktivita : a
              )
            }
          : p
      )
    );

    setShowEditModal(false);
    setAktualnaAktivita(null);
    setVybranyPacientId(null);
  };

  const handleVymazatAktivitu = () => {
    if (!aktivitaNaVymazanie) return;

    setPacienti(prev =>
      prev.map(p =>
        p.id === aktivitaNaVymazanie.pacientId
          ? {
              ...p,
              events: p.events.filter(a => a.id !== aktivitaNaVymazanie.aktivita.id)
            }
          : p
      )
    );

    setShowDeleteModal(false);
    setAktivitaNaVymazanie(null);
  };

  return (
    <section className="mb-10 mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 flex-1">Aktivity</h2>
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Hľadaj aktivitu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 shadow"
        >
          <FaPlus /> Pridať aktivitu
        </button>
      </div>

      {/* Tabuľka */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Názov aktivity</th>
              <th className="px-4 py-2 text-left">Pacient</th>
              <th className="px-4 py-2 text-left">Čas opakovania</th>
              <th className="px-4 py-2 text-left">Akcie</th>
            </tr>
          </thead>
          <tbody>
            {filtrovaneAktivity.map(({ id, nazovAktivity, casOpakovania, pacient }) => (
              <tr key={id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{nazovAktivity}</td>
                <td className="px-4 py-2">{pacient.meno} {pacient.priezvisko}</td>
                <td className="px-4 py-2">{casOpakovania}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => { 
                      setAktualnaAktivita({ id, nazovAktivity, casOpakovania }); 
                      setVybranyPacientId(pacient.id);
                      setShowEditModal(true); 
                    }}
                    className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 shadow"
                  >
                    <FaEdit className="text-green-600" /> Upraviť
                  </button>
                  <button
                    onClick={() => { setAktivitaNaVymazanie({ pacientId: pacient.id, aktivita: { id, nazovAktivity, casOpakovania } }); setShowDeleteModal(true); }}
                    className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 shadow"
                  >
                    <FaTrash className="text-red-600"/> Vymazať
                  </button>
                </td>
              </tr>
            ))}
            {filtrovaneAktivity.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 py-4">
                  Žiadne aktivity pre toto vyhľadávanie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modál - Pridať */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Pridať aktivitu</h3>
            <input
              type="text"
              placeholder="Názov aktivity"
              value={novaAktivita.nazovAktivity ?? ""}
              onChange={e => setNovaAktivita({ ...novaAktivita, nazovAktivity: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />
            <select
              value={vybranyPacientId ?? ""}
              onChange={e => setVybranyPacientId(parseInt(e.target.value))}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            >
              <option value="">Vybrať pacienta</option>
              {pacienti.map(pa => (
                <option key={pa.id} value={pa.id}>
                  {pa.meno} {pa.priezvisko}
                </option>
              ))}
            </select>
            <select
              value={novaAktivita.casOpakovania ?? ""}
              onChange={e => setNovaAktivita({ ...novaAktivita, casOpakovania: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            >
              <option value="">Vybrať čas opakovania</option>
              <option value="15m">Každých 15 minút</option>
              <option value="30m">Každých 30 minút</option>
              <option value="1h">Každú hodinu</option>
              <option value="3h">Každé 3 hodiny</option>
              <option value="6h">Každých 6 hodín</option>
              <option value="12h">Každých 12 hodín</option>
              <option value="24h">Každých 24 hodín</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
              <button onClick={handlePridatAktivitu} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Uložiť</button>
            </div>
          </div>
        </div>
      )}

      {/* Modál - Upraviť */}
      {showEditModal && aktualnaAktivita && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Upraviť aktivitu</h3>
            <input
              type="text"
              value={aktualnaAktivita.nazovAktivity}
              onChange={e => setAktualnaAktivita({ ...aktualnaAktivita, nazovAktivity: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />
            <select
              value={aktualnaAktivita.casOpakovania}
              onChange={e => setAktualnaAktivita({ ...aktualnaAktivita, casOpakovania: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            >
              <option value="15m">Každých 15 minút</option>
              <option value="30m">Každých 30 minút</option>
              <option value="1h">Každú hodinu</option>
              <option value="3h">Každé 3 hodiny</option>
              <option value="6h">Každých 6 hodín</option>
              <option value="12h">Každých 12 hodín</option>
              <option value="24h">Každých 24 hodín</option>
            </select>
            <div className="flex justify-between gap-2">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
              <button onClick={handleUpravitAktivitu} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Uložiť</button>
              <button onClick={() => { setAktivitaNaVymazanie({ pacientId: vybranyPacientId!, aktivita: aktualnaAktivita }); setShowDeleteModal(true); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"><FaTrash /> Vymazať</button>
            </div>
          </div>
        </div>
      )}

      {/* Modál - Vymazať */}
      {showDeleteModal && aktivitaNaVymazanie && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h3 className="text-xl font-semibold mb-4">Naozaj vymazať aktivitu?</h3>
            <p className="mb-4">
              {aktivitaNaVymazanie.aktivita.nazovAktivity} –{" "}
              {pacienti.find(pa => pa.id === aktivitaNaVymazanie.pacientId)?.meno}{" "}
              {pacienti.find(pa => pa.id === aktivitaNaVymazanie.pacientId)?.priezvisko}
            </p>
            <p className="mb-4 text-gray-600">
             Čas opakovania: {aktivitaNaVymazanie.aktivita.casOpakovania}
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
              <button onClick={handleVymazatAktivitu} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Vymazať</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
