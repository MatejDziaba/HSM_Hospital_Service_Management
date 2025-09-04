'use client';
import Pobyt from "@/app/Components/ui/CRUD/pobyt";
import BezPobytu from "@/app/Components/ui/CRUD/pobytBez";


export default function Oddelenie() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Správca Office</h1>

      {/* Pobyt */}
      <BezPobytu />

      {/* Pobyt */}
      <Pobyt />

    </div>
  );
}
