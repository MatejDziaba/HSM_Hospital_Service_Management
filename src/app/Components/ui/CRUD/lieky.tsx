'use client';
import { FaPills, FaPlus, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { liekyKategorie } from "@/app/mock-data/lieky";
import { ILiek } from "@/app/Interfaces";

export default function Lieky() {
  const [lieky, setLieky] = useState<ILiek[]>([
    { id: 1, nazov: "Paracetamol", dosage: "7", kategoria: "Nervový systém (N)", podkategoria: "Analgetiká" },
    { id: 2, nazov: "Ibuprofen", dosage: "5", kategoria: "Nervový systém (N)", podkategoria: "Analgetiká" },
    { id: 3, nazov: "Amoxicilin", dosage: "10", kategoria: "Antiinfektíva (J)", podkategoria: "Antibiotiká" },
  ]);

  const [search, setSearch] = useState("");
  const [filterKategoria, setFilterKategoria] = useState("");
  const [filterPodkategoria, setFilterPodkategoria] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [novyLiek, setNovyLiek] = useState({ nazov: "", dosage: "", kategoria: "", podkategoria: "" });
  const [aktualnyLiek, setAktualnyLiek] = useState<ILiek | null>(null);
  const [liekNaVymazanie, setLiekNaVymazanie] = useState<ILiek | null>(null);
  const [error, setError] = useState("");
  const [novaPodkategoria, setNovaPodkategoria] = useState("");

  const handlePridatPodkategoriu = () => {
    if (!novyLiek.kategoria) {
      setError("Vyberte kategóriu najprv!");
      return;
    }
    if (!novaPodkategoria.trim()) {
      setError("Zadajte názov podkategórie!");
      return;
    }

    const kategoriaIndex = liekyKategorie.findIndex(k => k.name === novyLiek.kategoria);
    if (kategoriaIndex !== -1 && !liekyKategorie[kategoriaIndex].podkategorie.includes(novaPodkategoria)) {
      liekyKategorie[kategoriaIndex].podkategorie.push(novaPodkategoria);
      setNovaPodkategoria("");
      setError("");
    }
  };

  const handlePridatLiek = () => {
    if (!novyLiek.nazov || novyLiek.dosage !== undefined|| !novyLiek.kategoria || !novyLiek.podkategoria) {
      setError("Vyplňte všetky polia správne!");
      return;
    }
    setLieky(prev => [
      ...prev,
      { id: prev.length + 1, ...novyLiek }
    ]);
    setShowAddModal(false);
    setNovyLiek({ nazov: "", dosage: "", kategoria: "", podkategoria: "" });
    setError("");
  };

  const handleUpravitLiek = () => {
    if (!aktualnyLiek) return;
    if (!aktualnyLiek.nazov || aktualnyLiek.dosage !== undefined || !aktualnyLiek.kategoria || !aktualnyLiek.podkategoria) {
      setError("Vyplňte všetky polia správne!");
      return;
    }
    setLieky(prev =>
      prev.map(l => l.id === aktualnyLiek.id ? aktualnyLiek : l)
    );
    setAktualnyLiek(null);
    setShowEditModal(false);
    setError("");
  };

  const handleVymazatLiek = () => {
    if (!liekNaVymazanie) return;
    setLieky(prev => prev.filter(l => l.id !== liekNaVymazanie.id));
    setShowDeleteModal(false);
    setLiekNaVymazanie(null);
    setShowEditModal(false); // <-- pridaj toto
  };

  // Funkcia na odstránenie diakritiky a prevod na malé písmená
const normalizeText = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Funkcia na filtrovanie liekov podľa search, kategórie a podkategórie
const filtrovatLieky = (
  lieky: ILiek[], 
  search: string, 
  kategoria?: string, 
  podkategoria?: string
) => {
  const searchNormalized = normalizeText(search);

  return lieky.filter(l => {
    const nazov = normalizeText(l.nazov);
    const kat = normalizeText(l.kategoria);
    const podkat = normalizeText(l.podkategoria);

    return (
      (nazov.includes(searchNormalized) ||
       kat.includes(searchNormalized) ||
       podkat.includes(searchNormalized)) &&
      (kategoria ? l.kategoria === kategoria : true) &&
      (podkategoria ? l.podkategoria === podkategoria : true)
    );
  });
};

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-3 gap-3">
        <h2 className="text-2xl font-semibold text-gray-900">Lieky</h2>
        <div className="flex gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Hľadaj liek..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 shadow"
          >
              <FaPlus /> Pridať liek
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-start mb-3 gap-3">
        <select
            value={filterKategoria}
            onChange={e => { setFilterKategoria(e.target.value); setFilterPodkategoria(""); }}
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Všetky kategórie</option>
            {liekyKategorie.map(k => (
              <option key={k.name} value={k.name}>{k.name}</option>
            ))}
          </select>

          {filterKategoria && (
            <select
              value={filterPodkategoria}
              onChange={e => setFilterPodkategoria(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Všetky podkategórie</option>
              {liekyKategorie.find(k => k.name === filterKategoria)?.podkategorie.map(pk => (
                <option key={pk} value={pk}>{pk}</option>
              ))}
            </select>
          )}
      </div>

      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtrovatLieky(lieky, search, filterKategoria, filterPodkategoria).map(l => (
          <div
            key={l.id}
            onClick={() => { setAktualnyLiek(l); setShowEditModal(true); }}
            className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow flex justify-between items-center cursor-pointer"
          >
            <div>
              <span className="font-medium">{l.nazov}</span>
              <p className="text-gray-500 text-sm">
                {l.kategoria} / {l.podkategoria} - Doba použitia: {l.dosage} dní
              </p>
            </div>
            <FaPills className="text-gray-400 text-xl"/>
          </div>
        ))}
      </div>

      {/* Modaly (pridanie, editácia, vymazanie) */}
      {showAddModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-96">
      <h3 className="text-xl font-semibold mb-4">Pridať liek</h3>

      <input
        type="text"
        placeholder="Názov lieku"
        value={novyLiek.nazov}
        onChange={e => setNovyLiek({ ...novyLiek, nazov: e.target.value })}
        className="w-full border px-3 py-2 rounded-lg mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      <input
        type="number"
        placeholder="Doba použitia (dni)"
        value={novyLiek.dosage}
        onChange={e => setNovyLiek({ ...novyLiek, dosage: e.target.value })}
        className="w-full border px-3 py-2 rounded-lg mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      <select
        value={novyLiek.kategoria}
        onChange={e => setNovyLiek({ ...novyLiek, kategoria: e.target.value, podkategoria: "" })}
        className="w-full border px-3 py-2 rounded-lg mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      >
        <option value="">Vyberte kategóriu</option>
        {liekyKategorie.map(k => (
          <option key={k.name} value={k.name}>{k.name}</option>
        ))}
      </select>

      {novyLiek.kategoria && (
        <div className="mb-2">
          <select
            value={novyLiek.podkategoria}
            onChange={e => setNovyLiek({ ...novyLiek, podkategoria: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Vyberte podkategóriu</option>
            {liekyKategorie.find(k => k.name === novyLiek.kategoria)?.podkategorie.map(pk => (
              <option key={pk} value={pk}>{pk}</option>
            ))}
          </select>

          {/* Pridanie novej podkategórie */}
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              placeholder="Nová podkategória"
              value={novaPodkategoria}
              onChange={e => setNovaPodkategoria(e.target.value)}
              className="flex-1 border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              onClick={handlePridatPodkategoriu}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Pridať
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
        <button onClick={handlePridatLiek} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Pridať</button>
      </div>
    </div>
  </div>
)}


      {showEditModal && aktualnyLiek && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Upraviť liek</h3>
            <input
              type="text"
              value={aktualnyLiek.nazov}
              onChange={e => setAktualnyLiek({ ...aktualnyLiek, nazov: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="number"
              value={aktualnyLiek.dosage}
              onChange={e => setAktualnyLiek({ ...aktualnyLiek, dosage: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <select
              value={aktualnyLiek.kategoria}
              onChange={e => setAktualnyLiek({ ...aktualnyLiek, kategoria: e.target.value, podkategoria: "" })}
              className="w-full border px-3 py-2 rounded-lg mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Vyberte kategóriu</option>
              {liekyKategorie.map(k => (
                <option key={k.name} value={k.name}>{k.name}</option>
              ))}
            </select>
            {aktualnyLiek.kategoria && (
              <select
                value={aktualnyLiek.podkategoria}
                onChange={e => setAktualnyLiek({ ...aktualnyLiek, podkategoria: e.target.value })}
                className="w-full border px-3 py-2 rounded-lg mb-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Vyberte podkategóriu</option>
                {liekyKategorie.find(k => k.name === aktualnyLiek.kategoria)?.podkategorie.map(pk => (
                  <option key={pk} value={pk}>{pk}</option>
                ))}
              </select>
            )}
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <div className="flex justify-between gap-2 mt-4">
              <button onClick={() => { setAktualnyLiek(null); setShowEditModal(false); }} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
              <button onClick={handleUpravitLiek} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Uložiť</button>
              <button onClick={() => { setLiekNaVymazanie(aktualnyLiek); setShowDeleteModal(true); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Vymazať</button>
            </div>
          </div>
        </div>
      )}

      

      {showDeleteModal && liekNaVymazanie && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h3 className="text-xl font-semibold mb-4">Naozaj vymazať liek?</h3>
            <p className="mb-4">{liekNaVymazanie.nazov}</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
              <button onClick={handleVymazatLiek} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Vymazať</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
