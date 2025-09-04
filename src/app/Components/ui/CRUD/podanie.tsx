'use client';
import React, { useEffect, useState } from "react";
import { FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import { ILiek, IPacient, IPodanie } from "../../../Interfaces";



export default function PodanieComponent() {
  // Dáta
  const [pacienti, setPacienti] = useState<IPacient[]>([]);
  const [lieky, setLieky] = useState<ILiek[]>([]);
  const [podania, setPodania] = useState<IPodanie[]>([]);

  // UI state
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false); // ⬅️ prepínač ukončených

  // Add/Edit/Delete state
  const [aktualnePodanie, setAktualnePodanie] = useState<IPodanie | null>(null);
  const [podanieNaVymazanie, setPodanieNaVymazanie] = useState<IPodanie | null>(null);

  const [vybranyPacientId, setVybranyPacientId] = useState<number | null>(null);

  useEffect(() => {
    // Mock pacienti
    setPacienti([
      { id: 1, meno: "Jozef", priezvisko: "Novák", rodneCislo: "800101/1234", oddelenie: "Chirurgia", medicines: [], events: [], pobyt: [] },
      { id: 2, meno: "Anna",  priezvisko: "Kováčová", rodneCislo: "755212/5678", oddelenie: "Interné",  medicines: [], events: [], pobyt: [] },
    ]);

    // Mock lieky
    setLieky([
      {
        id: 1, nazov: "Paracetamol",
        dosage: "",
        kategoria: "",
        podkategoria: ""
      },
      {
        id: 2, nazov: "Ibuprofen",
        dosage: "",
        kategoria: "",
        podkategoria: ""
      },
      {
        id: 3, nazov: "Amoxicilín",
        dosage: "",
        kategoria: "",
        podkategoria: ""
      },
    ]);

    // Mock podania
    setPodania([
      { idPodanie: 1, pacientId: 1, liekId: 1, zaciatokPodania: "2025-08-24T14:00", ukoncene: "" },
      { idPodanie: 2, pacientId: 2, liekId: 2, zaciatokPodania: "2025-08-23T08:30", ukoncene: "2025-08-25T12:00" },
    ]);
  }, []);

  const normalizeText = (text: string) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Zlúčené a filtrované riadky pre tabuľku (podanie + pacient + liek)
  const filtrovanePodania = podania
    .map(pd => {
      const pacient = pacienti.find(p => p.id === pd.pacientId);
      const liek = lieky.find(l => l.id === pd.liekId);
      return pacient && liek ? { ...pd, pacient, liek } : null;
    })
    .filter(Boolean)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((row: any) => {
      const isCompleted = row.ukoncene !== "";
      if (!showCompleted && isCompleted) return false; // ⬅️ skry ukončené keď checkbox nie je zaškrtnutý
      const hay = `${row.liek.nazov} ${row.pacient.meno} ${row.pacient.priezvisko} ${row.zaciatokPodania} ${row.ukoncene}`;
      return normalizeText(hay).includes(normalizeText(search));
    }) as Array<IPodanie & { pacient: IPacient; liek: ILiek }>;


  // ÚPRAVA
  const handleUpravitPodanie = () => {
    if (!aktualnePodanie || !vybranyPacientId) return; // pacient sa nemení

    setPodania(prev =>
      prev.map(p => (p.idPodanie === aktualnePodanie.idPodanie ? { ...aktualnePodanie } : p))
    );

    setShowEditModal(false);
    setAktualnePodanie(null);
    setVybranyPacientId(null);
  };

  // VYMAZANIE
  const handleVymazatPodanie = () => {
    if (!podanieNaVymazanie) return;

    setPodania(prev => prev.filter(p => p.idPodanie !== podanieNaVymazanie.idPodanie));

    setShowDeleteModal(false);
    setPodanieNaVymazanie(null);
  };

  return (
    <section className="mb-10 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 flex-1">Pacienti s podaním</h2>

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
            placeholder="Hľadaj podanie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Tabuľka */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Liek</th>
              <th className="px-4 py-2 text-left">Pacient</th>
              <th className="px-4 py-2 text-left">Začiatok podania</th>
              <th className="px-4 py-2 text-left">Ukončené</th>
              <th className="px-4 py-2 text-left">Akcie</th>
            </tr>
          </thead>
          <tbody>
            {filtrovanePodania.map(({ idPodanie, liek, pacient, zaciatokPodania, ukoncene }) => (
              <tr key={idPodanie} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{liek.nazov}</td>
                <td className="px-4 py-2">{pacient.meno} {pacient.priezvisko}</td>
                <td className="px-4 py-2">{zaciatokPodania}</td>
                <td className="px-4 py-2">{ukoncene}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => {
                      const current = podania.find(p => p.idPodanie === idPodanie)!;
                      setAktualnePodanie(current);
                      setVybranyPacientId(pacient.id);
                      setShowEditModal(true);
                    }}
                    className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 shadow"
                  >
                    <FaEdit className="text-green-600" /> Upraviť
                  </button>
                  <button
                    onClick={() => { 
                      const current = podania.find(p => p.idPodanie === idPodanie)!;
                      setPodanieNaVymazanie(current); 
                      setShowDeleteModal(true); 
                    }}
                    className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 shadow"
                  >
                    <FaTrash className="text-red-600" /> Vymazať
                  </button>
                </td>
              </tr>
            ))}
            {filtrovanePodania.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  Žiadne podania pre toto vyhľadávanie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modál - Upraviť */}
      {showEditModal && aktualnePodanie && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Upraviť podanie</h3>

            <label className="block text-sm mb-1">Liek</label>
            <select
              value={aktualnePodanie.liekId}
              onChange={(e) => setAktualnePodanie({ ...aktualnePodanie, liekId: parseInt(e.target.value) })}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            >
              {lieky.map(l => (
                <option key={l.id} value={l.id}>{l.nazov}</option>
              ))}
            </select>

            <label className="block text-sm mb-1">Začiatok podania</label>
            <input
              type="datetime-local"
              value={aktualnePodanie.zaciatokPodania}
              onChange={(e) => setAktualnePodanie({ ...aktualnePodanie, zaciatokPodania: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />

            <label className="block text-sm mb-1">Ukončené</label>
            <input
              type="datetime-local"
              value={aktualnePodanie.ukoncene ?? ""}
              onChange={(e) => setAktualnePodanie({ ...aktualnePodanie, ukoncene: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-6"
            />

            <div className="flex justify-between gap-2">
              <button onClick={() => { setShowEditModal(false); setAktualnePodanie(null); setVybranyPacientId(null); }} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
              <button onClick={handleUpravitPodanie} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Uložiť</button>
              <button
                onClick={() => { setPodanieNaVymazanie(aktualnePodanie); setShowDeleteModal(true); }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
              >
                <FaTrash /> Vymazať
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modál - Vymazať */}
      {showDeleteModal && podanieNaVymazanie && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h3 className="text-xl font-semibold mb-4">Naozaj vymazať podanie?</h3>
            <p className="mb-4">
              {lieky.find(l => l.id === podanieNaVymazanie.liekId)?.nazov} –{" "}
              {pacienti.find(pa => pa.id === podanieNaVymazanie.pacientId)?.meno}{" "}
              {pacienti.find(pa => pa.id === podanieNaVymazanie.pacientId)?.priezvisko}
            </p>
            <p className="mb-4 text-gray-600">
              Začiatok: {podanieNaVymazanie.zaciatokPodania} • Ukončené: {podanieNaVymazanie.ukoncene || "—"}
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
              <button onClick={handleVymazatPodanie} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Vymazať</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
