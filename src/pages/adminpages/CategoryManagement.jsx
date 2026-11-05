import { useState } from "react";
import { useCategory } from "../../utils/CategoryContext";

export default function CategoryManagement() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    isLoading,
    isError,
  } = useCategory();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredCategories = categories.filter((item) =>
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAddForm = () => {
    setEditingId(null);
    setCategoryName("");
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(item.category_id);
    setCategoryName(item.category);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setCategoryName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) return;

    setSubmitting(true);

    try {
      if (editingId) {
        await updateCategory(editingId, categoryName.trim());
      } else {
        await addCategory(categoryName.trim());
      }

      closeForm();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Yakin ingin menghapus kategori "${item.category}"?`
    );

    if (!confirmed) return;

    try {
      await deleteCategory(item.category_id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Manajemen Kategori
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola kategori untuk mengelompokkan produk SHOPMATE.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + Tambah Kategori
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Kategori
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {categories.length}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Kategori tersimpan di database
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Hasil Pencarian
          </p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {filteredCategories.length}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Kategori yang ditampilkan
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-slate-800">Daftar Kategori</h2>
            <p className="mt-1 text-xs text-slate-500">
              Data kategori dari database
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kategori..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 sm:w-64"
          />
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Memuat kategori...
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-red-500">
            Gagal mengambil data kategori. Periksa koneksi API.
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-slate-700">
              Kategori belum ditemukan
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Tambahkan kategori baru untuk mulai mengelompokkan produk.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">No.</th>
                  <th className="px-6 py-4">Nama Kategori</th>
                  <th className="px-6 py-4">ID Kategori</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((item, index) => (
                  <tr key={item.category_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-slate-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      #{item.category_id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditForm(item)}
                          className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {editingId ? "Edit Kategori" : "Tambah Kategori"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Masukkan nama kategori produk.
                </p>
              </div>

              <button
                onClick={closeForm}
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Contoh: Elektronik"
                  required
                  maxLength={255}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
