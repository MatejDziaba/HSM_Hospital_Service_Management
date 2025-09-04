"use client";

import { useState } from "react";
import { IPacient, IZamestnanec } from "../../Interfaces/index";

// Mock dáta
const mockPatients: IPacient[] = [
  {
    id: 1,
    meno: "Jana",
    priezvisko: "Nováková",
    medicines: [{
      id: 1, nazov: "Paracetamol", dosage: "3h",
      kategoria: "",
      podkategoria: ""
    }],
    rodneCislo: "000912/6491",
    oddelenie: "Chirurgia",
    events: [{ id: 1, nazovAktivity: "Rehabilitácia", casOpakovania: "24h"}],
    pobyt: [{ id: 1, cisloIzby: "101", zaciatok: "2025-08-27-14:45:55", ukoncene: ""}]
  },
  {
    id: 2,
    meno: "Marek",
    priezvisko: "Horváth",
    medicines: [{
      id: 2, nazov: "Ibuprofen", dosage: "3h",
      kategoria: "",
      podkategoria: ""
    }],
    rodneCislo: "000912/6491",
    oddelenie: "Chirurgia",
    events: [{ id: 1, nazovAktivity: "Cvičenie s loptou", casOpakovania: "24h"}],
    pobyt: [{ id: 1, cisloIzby: "102", zaciatok: "2025-08-27-14:55:55", ukoncene: ""}]
  },
];

const mockEmployees: IZamestnanec[] = [
  {
    id: 1, 
    meno: "Alena", 
    priezvisko: "Horváthova",
    rodneCislo: "000912/6491",
    nazovOddelenia: "Interna",    
    pocetPodanychLiekov: 0
  },
  {
    id: 2, 
    meno: "Petra", 
    priezvisko: "Horváthova",
    rodneCislo: "000912/6491",
    nazovOddelenia: "Chirurgia",    
    pocetPodanychLiekov: 0
  }
];

export default function ObsluhaPage() {
  const [patients] = useState<IPacient[]>(mockPatients);
  const [selectedEmployees, setSelectedEmployees] = useState<{ [key: string]: string }>({});

  const handleSelectChange = (patientId: string, employeeId: string) => {
    setSelectedEmployees((prev) => ({ ...prev, [patientId]: employeeId }));
  };

  const handleConfirmAdministration = (patientId: string) => {
    const employeeId = selectedEmployees[patientId];
    if (!employeeId) {
      alert("Vyberte sestru!");
      return;
    }
    alert(`Sestra ${employeeId} potvrdila podanie liekov pacientovi ${patientId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-[140px] px-6 md:px-12">
      <div className="flex flex-col space-y-8">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white shadow-lg rounded-xl p-8 flex flex-col transition hover:shadow-2xl"
          >
            {/* Hlavné info z diaľky */}
            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
              <div className="text-4xl font-semibold text-gray-700 mt-2 md:mt-0">
                {new Date(patient.medicines[0].dosage).toLocaleTimeString()}
              </div>
              <div className="text-4xl font-bold text-gray-800">
                Izba: {patient.pobyt[(patient.pobyt.length - 1)].cisloIzby}
              </div>
              <h2 className="text-2xl font-medium text-gray-600">
                {patient.meno} {patient.priezvisko}
              </h2>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-600 mb-3">Plánované lieky:</h3>
                <ul className="list-disc list-inside text-lg text-gray-700 space-y-1">
                    {patient.medicines.map((med) => (
                    <li key={med.id}>
                        {med.nazov} - {med.dosage}
                    </li>
                    ))}
                </ul>
            </div>
            </div>

            {/* Výber sestry a potvrdenie */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <select
                value={selectedEmployees[patient.id] || ""}
                onChange={(e) => handleSelectChange(patient.id.toString(), e.target.value)}
                className="border border-gray-300 rounded-lg px-5 py-4 text-xl flex-1"
              >
                <option value="">Vyberte sestru</option>
                {mockEmployees.map((emp) => (
                  <option key={emp.id} value={emp.meno}>
                    {emp.meno}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleConfirmAdministration(patient.id.toString())}
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg text-xl flex-1 transition"
              >
                Potvrdiť podanie
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
