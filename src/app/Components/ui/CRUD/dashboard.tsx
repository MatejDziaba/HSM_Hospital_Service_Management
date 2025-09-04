'use client';
import { useState, useEffect, JSX } from "react";
import { FaUser, FaHospital, FaChartLine } from "react-icons/fa";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

interface DashboardStats {
  pacientiCelkovo: number;
  zamestnanci: number;
  oddelenia: number;
  topZamestnanec: {
    meno: string;
    priezvisko: string;
    rodneCislo: string;
    oddelenie: string;
    pocetPodani: number;
    pocetAktivit: number;
  };
}

interface OddeleniePacienti {
  oddelenie: string;
  pocetPacientov: number;
}

interface OddelenieDetail {
  oddelenie: string;
  pocetPodani: number;
  pocetAktivit: number;
}

interface Zamestnanec {
  meno: string;
  priezvisko: string;
  oddelenie: string;
  pocetPodani: number;
  pocetAktivit: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pacientiNaOddelenie, setPacientiNaOddelenie] = useState<OddeleniePacienti[]>([]);
  const [zamestnanciNaOddelenie, setZamestnanciNaOddelenie] = useState<Zamestnanec[]>([]);
  const [oddeleniaDetail, setOddeleniaDetail] = useState<OddelenieDetail[]>([]);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const mockStats: DashboardStats = {
      pacientiCelkovo: 120,
      zamestnanci: 15,
      oddelenia: 3,
      topZamestnanec: {
        meno: "Hugo",
        priezvisko: "Novak",
        rodneCislo: "0009/6491",
        oddelenie: "Chirurgia",
        pocetPodani: 25,
        pocetAktivit: 12,
      },
    };

    const mockPacienti = [
      { oddelenie: "Chirurgia", pocetPacientov: 40 },
      { oddelenie: "Interné", pocetPacientov: 50 },
      { oddelenie: "Ortopédia", pocetPacientov: 30 },
    ];

    const mockZamestnanci = [
      { meno: "Jozef", priezvisko: "Mrkvička", oddelenie: "Chirurgia", pocetPodani: 12, pocetAktivit: 8 },
      { meno: "Anna", priezvisko: "Kováčová", oddelenie: "Interné", pocetPodani: 20, pocetAktivit: 15 },
      { meno: "Eva", priezvisko: "Novotná", oddelenie: "Ortopédia", pocetPodani: 10, pocetAktivit: 6 },
    ];

    const mockOddeleniaDetail = [
      { oddelenie: "Chirurgia", pocetPodani: 120, pocetAktivit: 80 },
      { oddelenie: "Interné", pocetPodani: 90, pocetAktivit: 60 },
      { oddelenie: "Ortopédia", pocetPodani: 70, pocetAktivit: 50 },
    ];

    setStats(mockStats);
    setPacientiNaOddelenie(mockPacienti);
    setZamestnanciNaOddelenie(mockZamestnanci);
    setOddeleniaDetail(mockOddeleniaDetail);
  }, []);

  if (!stats) return null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      {/* Pacienti celkovo */}
      <div
        onClick={() =>
          setModalContent(
            <div>
              <h2 className="text-xl font-bold mb-4">Pacienti podľa oddelení</h2>
              <PieChart width={350} height={300}>
                <Pie
                  data={pacientiNaOddelenie}
                  dataKey="pocetPacientov"
                  nameKey="oddelenie"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pacientiNaOddelenie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip />
                <Legend />
              </PieChart>
            </div>
          )
        }
        className="cursor-pointer p-4 rounded-xl text-white bg-gradient-to-r from-green-500 to-teal-500 shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform"
      >
        <FaUser className="text-3xl mb-2" />
        <span className="text-sm">Pacienti celkovo</span>
        <span className="text-2xl font-semibold mt-1">{stats.pacientiCelkovo}</span>
      </div>

      {/* Zamestnanci */}
      <div
        onClick={() =>
          setModalContent(
            <div>
              <h2 className="text-xl font-bold mb-4">Zamestnanci – podania a aktivity</h2>
              <BarChart width={400} height={300} data={zamestnanciNaOddelenie}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="meno" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Bar dataKey="pocetPodani" fill="#8884d8" />
                <Bar dataKey="pocetAktivit" fill="#82ca9d" />
              </BarChart>
            </div>
          )
        }
        className="cursor-pointer p-4 rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform"
      >
        <FaUser className="text-3xl mb-2" />
        <span className="text-sm">Zamestnanci</span>
        <span className="text-2xl font-semibold mt-1">{stats.zamestnanci}</span>
      </div>

      {/* Oddelenia */}
      <div
        onClick={() =>
          setModalContent(
            <div>
              <h2 className="text-xl font-bold mb-4">Oddelenia – podania a aktivity</h2>
              <BarChart width={400} height={300} data={oddeleniaDetail}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="oddelenie" />
                <YAxis />
                <ReTooltip />
                <Legend />
                <Bar dataKey="pocetPodani" fill="#ff7300" />
                <Bar dataKey="pocetAktivit" fill="#387908" />
              </BarChart>
            </div>
          )
        }
        className="cursor-pointer p-4 rounded-xl text-white bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform"
      >
        <FaHospital className="text-3xl mb-2" />
        <span className="text-sm">Oddelenia</span>
        <span className="text-2xl font-semibold mt-1">{stats.oddelenia}</span>
      </div>

      {/* Top zamestnanec */}
      <div
        onClick={() =>
          setModalContent(
            <div>
              <h2 className="text-xl font-bold mb-4">Top zamestnanec</h2>
              <p><b>Meno:</b> {stats.topZamestnanec.meno} {stats.topZamestnanec.priezvisko}</p>
              <p><b>Rodné číslo:</b> {stats.topZamestnanec.rodneCislo}</p>
              <p><b>Oddelenie:</b> {stats.topZamestnanec.oddelenie}</p>
              <p><b>Počet podaní:</b> {stats.topZamestnanec.pocetPodani}</p>
              <p><b>Počet aktivít:</b> {stats.topZamestnanec.pocetAktivit}</p>
            </div>
          )
        }
        className="cursor-pointer p-4 rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-600 shadow-lg flex flex-col items-center justify-center hover:scale-105 transition-transform"
      >
        <FaChartLine className="text-3xl mb-2" />
        <span className="text-sm">Top zamestnanec</span>
        <span className="text-2xl font-semibold mt-1">
          {stats.topZamestnanec.meno} {stats.topZamestnanec.priezvisko}
        </span>
      </div>

      {/* Modal */}
      {modalContent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-xl p-6 shadow-xl w-[420px] relative">
            {modalContent}
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
