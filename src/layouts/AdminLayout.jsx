import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/products": "Manajemen Produk",
  "/admin/orders": "Manajemen Pesanan",
  "/admin/about": "Tentang Aplikasi",
  "/admin/categories": "Manajemen Kategori",
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const currentPage = pageTitles[location.pathname] || "SHOPMATE";

  return (
    <div className="flex min-h-screen w-full bg-slate-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xl text-slate-700 md:hidden"
            >
              ☰
            </button>

            <div>
              <p className="text-xs font-medium text-slate-400">
                SHOPMATE / ADMIN
              </p>
              <h1 className="text-lg font-bold text-slate-800">
                {currentPage}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Admin SHOPMATE
              </p>
              <p className="text-xs text-slate-400">
                Store Administrator
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              A
            </div>
          </div>
        </header>

        <main className="w-full flex-1 p-5 md:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white px-6 py-5 text-center text-xs text-slate-500">
          © 2026 SHOPMATE — E-Commerce Backoffice
        </footer>
      </div>
    </div>
  );
}
