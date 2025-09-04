'use client';
import { IZamestnanec } from "@/app/Interfaces";
import { useState, useEffect } from "react";
import { FaUser, FaSearch, FaTrash, FaPlus } from "react-icons/fa";

export default function Zamestnanci() {
  const [zamestnanci, setZamestnanci] = useState<IZamestnanec[]>([]);
  const [vybraneOddelenie, setVybraneOddelenie] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<"alphabet" | "lieky">("alphabet");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [novyZamestnanec, setNovyZamestnanec] = useState({
    meno: "",
    priezvisko: "",
    rodneCislo: "",
    nazovOddelenia: ""
  });

  const [aktualnyZamestnanec, setAktualnyZamestnanec] = useState<IZamestnanec | null>(null);
  const [zamestnanecNaVymazanie, setZamestnanecNaVymazanie] = useState<IZamestnanec | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const mockZamestnanci: IZamestnanec[] = [
      { id: 1, meno: "Hugo", priezvisko: "Novak", nazovOddelenia: "Chirurgia", rodneCislo: "0009126491", pocetPodanychLiekov: 8 },
      { id: 2, meno: "Anna", priezvisko: "Kovacova", nazovOddelenia: "Interna", pocetPodanychLiekov: 4, rodneCislo: "0009126491" },
      { id: 3, meno: "Peter", priezvisko: "Horvath", nazovOddelenia: "Pediatria", pocetPodanychLiekov: 5, rodneCislo: "0009126491" },
    ];
    setZamestnanci(mockZamestnanci);
  }, []);

  const oddelenia = Array.from(new Set(zamestnanci.map(z => z.nazovOddelenia)));

  function overRodneCislo(rc: string): boolean {
    const cisla = rc.replace("/", "");
    if (!/^\d{9,10}$/.test(cisla)) return false;

    const datum = cisla.substring(0, 6);
    const yy = parseInt(datum.substring(0, 2), 10);
    let mm = parseInt(datum.substring(2, 4), 10);
    const dd = parseInt(datum.substring(4, 6), 10);
    if (mm > 50) mm -= 50;
    const fullYear = yy < 54 ? 2000 + yy : 1900 + yy;
    const date = new Date(fullYear, mm - 1, dd);
    if (date.getFullYear() !== fullYear || date.getMonth() + 1 !== mm || date.getDate() !== dd) return false;
    if (cisla.length === 10 && parseInt(cisla, 10) % 11 !== 0) return false;
    return true;
  }

  const handlePridatZamestnanca = () => {
    if (!novyZamestnanec.meno || !novyZamestnanec.priezvisko || !novyZamestnanec.rodneCislo || !novyZamestnanec.nazovOddelenia) {
      setError("Vyplňte všetky polia!");
      return;
    }
    if (!overRodneCislo(novyZamestnanec.rodneCislo)) {
      setError("Neplatné rodné číslo podľa legislatívy SR!");
      return;
    }

    setZamestnanci(prev => [
      ...prev,
      {
        id: prev.length + 1,
        meno: novyZamestnanec.meno,
        priezvisko: novyZamestnanec.priezvisko,
        nazovOddelenia: novyZamestnanec.nazovOddelenia,
        rodneCislo: novyZamestnanec.rodneCislo,
        pocetPodanychLiekov: 0
      }
    ]);
    setShowAddModal(false);
    setNovyZamestnanec({ meno: "", priezvisko: "", rodneCislo: "", nazovOddelenia: "" });
    setError("");
  };

  const handleUpravitZamestnanca = () => {
    if (!aktualnyZamestnanec) return;
    if (!aktualnyZamestnanec.meno || !aktualnyZamestnanec.priezvisko || !aktualnyZamestnanec.rodneCislo || !aktualnyZamestnanec.nazovOddelenia) {
      setError("Vyplňte všetky polia!");
      return;
    }
    if (!overRodneCislo(aktualnyZamestnanec.rodneCislo)) {
      setError("Neplatné rodné číslo podľa legislatívy SR!");
      return;
    }

    setZamestnanci(prev =>
      prev.map(z => z.id === aktualnyZamestnanec.id ? aktualnyZamestnanec : z)
    );
    setShowEditModal(false);
    setAktualnyZamestnanec(null);
    setError("");
  };

  const handleVymazatZamestnanca = () => {
    if (!zamestnanecNaVymazanie) return;
    setZamestnanci(prev => prev.filter(z => z.id !== zamestnanecNaVymazanie.id));
    setShowDeleteModal(false);
    setShowEditModal(false);
    setAktualnyZamestnanec(null);
  };

// Normalizácia textu
const normalizeText = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Filtrovanie zamestnancov
const filtrovani: IZamestnanec[] = zamestnanci
  .filter(z => !vybraneOddelenie || z.nazovOddelenia === vybraneOddelenie)
  .filter(z => {
    const searchNormalized = normalizeText(search);
    return (
      normalizeText(z.meno).includes(searchNormalized) ||
      normalizeText(z.priezvisko).includes(searchNormalized) ||
      normalizeText(z.nazovOddelenia).includes(searchNormalized)
    );
  });

// Zoradenie zamestnancov
const zoradeni: IZamestnanec[] = [...filtrovani].sort((a, b) => {
  if (sortOption === "alphabet") {
    return a.meno.localeCompare(b.meno) || a.priezvisko.localeCompare(b.priezvisko);
  } else {
    return b.pocetPodanychLiekov - a.pocetPodanychLiekov;
  }
});


  return (
    <section className="mb-10 mt-6">
      {/* Header a filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 flex-1">
          {vybraneOddelenie ? `Zamestnanci oddelenia: ${vybraneOddelenie}` : "Všetci zamestnanci"}
        </h2>

        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Hľadaj zamestnanca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 shadow"
        >
            <FaPlus /> Pridať zamestnanca
        </button>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
        <label className="text-gray-700 font-medium" htmlFor="oddelenieSelect">Filtrovať podľa oddelenia:</label>
        <select
          id="oddelenieSelect"
          value={vybraneOddelenie ?? ""}
          onChange={(e) => setVybraneOddelenie(e.target.value || null)}
          className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Všetky</option>
          {oddelenia.map(o => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        <label className="text-gray-700 font-medium" htmlFor="sortSelect">Zoradiť podľa:</label>
        <select
          id="sortSelect"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as "alphabet" | "lieky")}
          className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="alphabet">Podľa mena</option>
          <option value="lieky">Počet podaní</option>
        </select>
      </div>

      {/* Zoznam zamestnancov */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {zoradeni.map(z => (
          <div
            key={z.id}
            className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow flex flex-col md:flex-row items-start md:items-center gap-4 cursor-pointer"
            onClick={() => { setAktualnyZamestnanec(z); setShowEditModal(true); }}
          >
            <FaUser className="text-gray-400 text-2xl md:text-xl" />
            <div className="flex-1">
              <span className="font-medium text-gray-800">{z.meno} {z.priezvisko}</span>
            </div>
            <div className="flex-1 text-gray-600">{z.nazovOddelenia}</div>
            <div className="flex-1 text-gray-800 font-medium">Počet podaní: {z.pocetPodanychLiekov}</div>
          </div>
        ))}
        {zoradeni.length === 0 && (
          <p className="text-gray-500 col-span-full">Žiadni zamestnanci pre toto oddelenie alebo vyhľadávanie.</p>
        )}
      </div>

      {/* Modal pre pridanie, úpravu a vymazanie */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Pridať zamestnanca</h3>
            <input type="text" placeholder="Meno" value={novyZamestnanec.meno} onChange={e => setNovyZamestnanec({ ...novyZamestnanec, meno: e.target.value })} className="w-full border p-2 rounded mb-2" />
            <input type="text" placeholder="Priezvisko" value={novyZamestnanec.priezvisko} onChange={e => setNovyZamestnanec({ ...novyZamestnanec, priezvisko: e.target.value })} className="w-full border p-2 rounded mb-2" />
            <input type="text" placeholder="Rodné číslo (RRMMDD/XXXX)" value={novyZamestnanec.rodneCislo} onChange={e => setNovyZamestnanec({ ...novyZamestnanec, rodneCislo: e.target.value })} className="w-full border p-2 rounded mb-2" />
            <select value={novyZamestnanec.nazovOddelenia} onChange={e => setNovyZamestnanec({ ...novyZamestnanec, nazovOddelenia: e.target.value })} className="w-full border p-2 rounded mb-2">
              <option value="">Vybrať oddelenie</option>
              {oddelenia.map(o => (<option key={o} value={o}>{o}</option>))}
            </select>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
              <button onClick={handlePridatZamestnanca} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Uložiť</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && aktualnyZamestnanec && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Upraviť zamestnanca</h3>
            <input type="text" placeholder="Meno" value={aktualnyZamestnanec.meno} onChange={e => setAktualnyZamestnanec({ ...aktualnyZamestnanec, meno: e.target.value })} className="w-full border p-2 rounded mb-2" />
            <input type="text" placeholder="Priezvisko" value={aktualnyZamestnanec.priezvisko} onChange={e => setAktualnyZamestnanec({ ...aktualnyZamestnanec, priezvisko: e.target.value })} className="w-full border p-2 rounded mb-2" />
            <input type="text" placeholder="Rodné číslo" value={aktualnyZamestnanec.rodneCislo} onChange={e => setAktualnyZamestnanec({ ...aktualnyZamestnanec, rodneCislo: e.target.value })} className="w-full border p-2 rounded mb-2" />
            <select value={aktualnyZamestnanec.nazovOddelenia} onChange={e => setAktualnyZamestnanec({ ...aktualnyZamestnanec, nazovOddelenia: e.target.value })} className="w-full border p-2 rounded mb-2">
              <option value="">Vybrať oddelenie</option>
              {oddelenia.map(o => (<option key={o} value={o}>{o}</option>))}
            </select>
            <input type="number" placeholder="Počet podaných liekov" value={aktualnyZamestnanec.pocetPodanychLiekov} onChange={e => setAktualnyZamestnanec({ ...aktualnyZamestnanec, pocetPodanychLiekov: parseInt(e.target.value) })} className="w-full border p-2 rounded mb-2" />
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <div className="flex justify-between gap-2 mt-4">
              <button onClick={() => { setShowEditModal(false); setAktualnyZamestnanec(null); }} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
              <button onClick={handleUpravitZamestnanca} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Uložiť</button>
              <button onClick={() => { setZamestnanecNaVymazanie(aktualnyZamestnanec); setShowDeleteModal(true); }} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"><FaTrash /> Vymazať</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && zamestnanecNaVymazanie && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h3 className="text-xl font-semibold mb-4">Naozaj vymazať zamestnanca?</h3>
            <p className="mb-4">{zamestnanecNaVymazanie.meno} {zamestnanecNaVymazanie.priezvisko}</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Zrušiť</button>
              <button onClick={handleVymazatZamestnanca} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Vymazať</button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
