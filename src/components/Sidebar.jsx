import { NavLink, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

const menuItems = [
  { title: "Dashboard", path: "/admin/dashboard", icon: "▦" },
  { title: "Manajemen Produk", path: "/admin/products", icon: "▣" },
  { title: "Manajemen Kategori", path: "/admin/categories", icon: "▧" },
  { title: "Manajemen Pesanan", path: "/admin/orders", icon: "▤" },
  { title: "Tentang Aplikasi", path: "/admin/about", icon: "ⓘ" },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post("/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col bg-slate-950 text-white shadow-xl transition-transform duration-300 md:sticky md:top-0 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ transform: undefined }}
      >
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">SHOPMATE</h1>
            <p className="text-xs text-slate-400">E-Commerce Backoffice</p>
          </div>
        </div>

        <div className="px-5 pt-8">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span className="w-6 text-center text-lg">{item.icon}</span>
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-5">
          <div className="mb-4 rounded-xl bg-white/5 p-4">
            <p className="text-sm font-semibold">Admin SHOPMATE</p>
            <p className="mt-1 text-xs text-slate-400">Store Management</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
