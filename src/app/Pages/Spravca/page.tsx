'use client';
import Zamestnanci from "@/app/Components/ui/CRUD/zamestnanci";
import Lieky from "../../Components/ui/CRUD/lieky";
import Dashboard from "@/app/Components/ui/CRUD/dashboard";
import Oddelenia  from "@/app/Components/ui/CRUD/oddelenie";
import Podanie from "@/app/Components/ui/CRUD/pobyt";
import Pacienti from "@/app/Components/ui/CRUD/pacient/pacient";
import Aktivity from "@/app/Components/ui/CRUD/aktivita/aktivita";


export default function SpravcaOfficePage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Správca Office</h1>

      {/* Dashboard */}
      <Dashboard />

      {/* Oddelenia */}
      <Oddelenia />

      {/* Zamestnanci */}
      <Zamestnanci />

      {/* Lieky */}
      <Lieky />

      {/* Podanie */}
      <Podanie />

      {/* Pacienti */}
      <Pacienti />

      {/* Aktivity */}
      <Aktivity />

    </div>
  );
}
