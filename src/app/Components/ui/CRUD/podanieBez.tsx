'use client';
import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { IPacient } from "../../../Interfaces";
import { liekyKategorie } from "../../../mock-data/lieky"; // <- sem importuj tvoj súbor s kategóriami

interface ILiek { idLiek: number; nazov: string; }
interface IPodanie {
  idPodanie: number;
  pacientId: number;
  liekId: number;
  zaciatokPodania: string;
  ukoncene: string;
}

export default function PodanieBez() {
  const [pacienti, setPacienti] = useState<IPacient[]>([]);
  const [lieky, setLieky] = useState<ILiek[]>([]);
  const [podania, setPodania] = useState<IPodanie[]>([]);

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [vybranyPacientId, setVybranyPacientId] = useState<number | null>(null);
  const [novePodanie, setNovePodanie] = useState<Partial<IPodanie>>({
    liekId: undefined,
    zaciatokPodania: "",
    ukoncene: "",
  });

  // pre výber kategórie/podkategórie
  const [vybranaKategoria, setVybranaKategoria] = useState<string>("");
  const [vybranaPodkategoria, setVybranaPodkategoria] = useState<string>("");

  useEffect(() => {
    setPacienti([
      { id: 1, meno: "Jozef", priezvisko: "Novák", rodneCislo: "800101/1234", oddelenie: "Chirurgia", medicines: [], events: [], pobyt: [] },
      { id: 2, meno: "Anna", priezvisko: "Kováčová", rodneCislo: "755212/5678", oddelenie: "Interné", medicines: [], events: [], pobyt: [] },
      { id: 3, meno: "Matej", priezvisko: "Kováč", rodneCislo: "700101/2222", oddelenie: "Interné", medicines: [], events: [], pobyt: [] },
    ]);
    setLieky([
      { idLiek: 1, nazov: "Paracetamol" },
      { idLiek: 2, nazov: "Ibuprofen" },
      { idLiek: 3, nazov: "Amoxicilín" },
    ]);
    setPodania([
      { idPodanie: 1, pacientId: 1, liekId: 1, zaciatokPodania: "2025-08-24T14:00", ukoncene: "" },
    ]);
  }, []);

  const normalize = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const pacientiBezPodania = useMemo(() => {
    const withPodanie = new Set(podania.map(p => p.pacientId));
    return pacienti.filter(p => !withPodanie.has(p.id));
  }, [pacienti, podania]);

  const filtrovani = useMemo(() => {
    const q = normalize(search);
    return pacientiBezPodania.filter(p => {
      const hay = `${p.meno} ${p.priezvisko} ${p.rodneCislo} ${p.oddelenie}`;
      return normalize(hay).includes(q);
    });
  }, [pacientiBezPodania, search]);

  const handlePridatPodanie = () => {
    if (!vybranyPacientId || !novePodanie.liekId || !novePodanie.zaciatokPodania) return;
    setPodania(prev => [
      ...prev,
      {
        idPodanie: Date.now(),
        pacientId: vybranyPacientId,
        liekId: novePodanie.liekId!,
        zaciatokPodania: novePodanie.zaciatokPodania!,
        ukoncene: novePodanie.ukoncene ?? "",
      },
    ]);
    setShowAddModal(false);
    setVybranyPacientId(null);
    setNovePodanie({ liekId: undefined, zaciatokPodania: "", ukoncene: "" });
    setVybranaKategoria("");
    setVybranaPodkategoria("");
  };

  const dostupnePodkategorie = useMemo(() => {
    const kat = liekyKategorie.find(k => k.name === vybranaKategoria);
    return kat ? kat.podkategorie : [];
  }, [vybranaKategoria]);

  return (
    <section className="mb-10 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 flex-1">Pacienti bez podania</h2>
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Hľadaj pacienta..."
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
              <th className="px-4 py-2 border-b text-left">Rodné číslo</th>
              <th className="px-4 py-2 border-b text-left">Oddelenie</th>
              <th className="px-4 py-2 border-b text-left">Akcia</th>
            </tr>
          </thead>
          <tbody>
            {filtrovani.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{p.meno} {p.priezvisko}</td>
                <td className="px-4 py-2 border-b">{p.rodneCislo}</td>
                <td className="px-4 py-2 border-b">{p.oddelenie}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => {
                        setVybranyPacientId(p.id);
                        setShowAddModal(true);
                    }}
                    className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 shadow">
                    <FaPlus /> Pridať podanie
                </button>
                </td>
              </tr>
            ))}
            {filtrovani.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                  Žiadni pacienti bez podania.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modál */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <h3 className="text-xl font-semibold mb-4">Pridať podanie</h3>

            <p className="mb-2 text-blue-700 bold">
              Pacient:{" "}
              {pacienti.find(p => p.id === vybranyPacientId)?.meno}{" "}
              {pacienti.find(p => p.id === vybranyPacientId)?.priezvisko}
            </p>

            {/* Výber kategórie */}
            <label className="block text-sm mb-1">Kategória lieku</label>
            <select
              value={vybranaKategoria}
              onChange={(e) => {
                setVybranaKategoria(e.target.value);
                setVybranaPodkategoria("");
              }}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            >
              <option value="">Vybrať kategóriu</option>
              {liekyKategorie.map((k, i) => (
                <option key={i} value={k.name}>{k.name}</option>
              ))}
            </select>

            {/* Výber podkategórie */}
            {vybranaKategoria && (
              <>
                <label className="block text-sm mb-1">Podkategória</label>
                <select
                  value={vybranaPodkategoria}
                  onChange={(e) => setVybranaPodkategoria(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg mb-4"
                >
                  <option value="">Vybrať podkategóriu</option>
                  {dostupnePodkategorie.map((pk, i) => (
                    <option key={i} value={pk}>{pk}</option>
                  ))}
                </select>
              </>
            )}

            {/* Výber konkrétneho lieku */}
            {vybranaPodkategoria && (
              <>
                <label className="block text-sm mb-1">Liek</label>
                <select
                  value={novePodanie.liekId ?? ""}
                  onChange={(e) => setNovePodanie({ ...novePodanie, liekId: parseInt(e.target.value, 10) })}
                  className="w-full border px-3 py-2 rounded-lg mb-4"
                >
                  <option value="">Vybrať liek</option>
                  {lieky.map(l => (
                    <option key={l.idLiek} value={l.idLiek}>{l.nazov}</option>
                  ))}
                </select>
              </>
            )}

            <label className="block text-sm mb-1">Začiatok podania</label>
            <input
              type="datetime-local"
              value={novePodanie.zaciatokPodania ?? ""}
              onChange={(e) => setNovePodanie({ ...novePodanie, zaciatokPodania: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />

            <label className="block text-sm mb-1">Ukončené (nechaj prázdne ak prebieha)</label>
            <input
              type="datetime-local"
              value={novePodanie.ukoncene ?? ""}
              onChange={(e) => setNovePodanie({ ...novePodanie, ukoncene: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-6"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setVybranyPacientId(null);
                  setNovePodanie({ liekId: undefined, zaciatokPodania: "", ukoncene: "" });
                  setVybranaKategoria("");
                  setVybranaPodkategoria("");
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
