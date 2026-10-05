import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";

export default function MainLayout() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua Kategori");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <header className="bg-gray-100 p-4 flex flex-col md:flex-row gap-2 justify-between items-center">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option>Semua Kategori</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Kecantikan</option>
        </select>
      </header>

      <main className="flex-1 p-6">
        <Outlet context={{ search, category }} />
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        <p>© 2025 E-Commerce Simple App | Version 1.0</p>
      </footer>
    </div>
  );
}