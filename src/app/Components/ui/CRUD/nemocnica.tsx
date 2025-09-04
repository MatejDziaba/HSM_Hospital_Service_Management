'use client';
import { INemocnica } from "@/app/Interfaces";
import React, { useState, useMemo } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function Nemocnica() {
  const [nemocnice, setNemocnice] = useState<INemocnica[]>([
    { id: 1, nazov: "Univerzitná nemocnica Bratislava" },
    { id: 2, nazov: "Fakultná nemocnica Žilina" },
    { id: 3, nazov: "Nemocnica Košice-Šaca" },
  ]);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [novaNemocnica, setNovaNemocnica] = useState("");
  const [editovanaNemocnica, setEditovanaNemocnica] = useState<INemocnica | null>(null);
  const [nemocnicaNaVymazanie, setNemocnicaNaVymazanie] = useState<INemocnica | null>(null);

  // funkcia na odstránenie diakritiky
  const normalize = (text: string) =>
    text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filtrovaneNemocnice = useMemo(() => {
    const q = normalize(search);
    const filtered = nemocnice.filter(n => normalize(n.nazov).includes(q));
    return filtered.sort((a, b) =>
      sortAsc ? a.nazov.localeCompare(b.nazov) : b.nazov.localeCompare(a.nazov)
    );
  }, [nemocnice, search, sortAsc]);

  const handleAdd = () => {
    if (!novaNemocnica.trim()) return;
    setNemocnice(prev => [
      ...prev,
      { id: Date.now(), nazov: novaNemocnica.trim() },
    ]);
    setNovaNemocnica("");
    setShowAddModal(false);
  };

  const handleEdit = () => {
    if (!editovanaNemocnica) return;
    setNemocnice(prev =>
      prev.map(n =>
        n.id === editovanaNemocnica.id ? editovanaNemocnica : n
      )
    );
    setEditovanaNemocnica(null);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (!nemocnicaNaVymazanie) return;
    setNemocnice(prev =>
      prev.filter(n => n.id !== nemocnicaNaVymazanie.id)
    );
    setNemocnicaNaVymazanie(null);
    setShowDeleteModal(false);
  };

  return (
    <section className="mb-10 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 flex-1">Nemocnice</h2>
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Hľadaj nemocnicu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 shadow"
        >
          <FaPlus /> Pridať nemocnicu
        </button>
      </div>

      {/* Tabuľka */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th
                className="px-4 py-2 text-left cursor-pointer hover:text-blue-600"
                onClick={() => setSortAsc(!sortAsc)}
              >
                Názov {sortAsc ? "▲" : "▼"}
              </th>
              <th className="px-4 py-2 text-center">Akcie</th>
            </tr>
          </thead>
          <tbody>
            {filtrovaneNemocnice.map(n => (
              <tr key={n.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">{n.nazov}</td>
                <td className="px-4 py-2 text-center space-x-2">
                  <button
                    onClick={() => { setEditovanaNemocnica(n); setShowEditModal(true); }}
                    className="px-3 py-1 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 flex items-center gap-2 inline-flex"
                  >
                    <FaEdit /> Upraviť
                  </button>
                  <button
                    onClick={() => { setNemocnicaNaVymazanie(n); setShowDeleteModal(true); }}
                    className="px-3 py-1 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 inline-flex"
                  >
                    <FaTrash /> Vymazať
                  </button>
                </td>
              </tr>
            ))}
            {filtrovaneNemocnice.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center text-gray-500 py-4">
                  Žiadne nemocnice pre toto vyhľadávanie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold mb-4">Pridať nemocnicu</h2>
            <input
              type="text"
              value={novaNemocnica}
              onChange={(e) => setNovaNemocnica(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-4"
              placeholder="Názov nemocnice"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Zrušiť
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Uložiť
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editovanaNemocnica && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold mb-4">Upraviť nemocnicu</h2>
            <input
              type="text"
              value={editovanaNemocnica.nazov}
              onChange={(e) =>
                setEditovanaNemocnica({ ...editovanaNemocnica, nazov: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Zrušiť
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Uložiť
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && nemocnicaNaVymazanie && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold mb-4">Vymazať nemocnicu</h2>
            <p className="mb-4">
              Naozaj chceš vymazať nemocnicu{" "}
              <span className="font-semibold">{nemocnicaNaVymazanie.nazov}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Zrušiť
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
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
