import { useState } from "react";
import { useProduct } from "../../utils/ProductContext";
import { useCategory } from "../../utils/CategoryContext";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category_id: "",
  img: null,
};

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function ProductManagement() {
  const {
    products,
    pagination,
    page,
    limit,
    setPage,
    setLimit,
    applyFilters,
    resetFilters,
    addProduct,
    updateProduct,
    deleteProduct,
    isLoading,
    isError,
  } = useProduct();

  const { categories = [] } = useCategory();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const totalProducts = pagination.total ?? products.length;
  const currentPage = pagination.current_page ?? page;
  const lastPage = pagination.last_page ?? 1;
  const from = pagination.from ?? (products.length ? 1 : 0);
  const to = pagination.to ?? products.length;

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreview("");
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category_id: String(product.category_id || ""),
      img: null,
    });
    setPreview(product.img || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setPreview("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setForm((previous) => ({
      ...previous,
      img: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.price ||
      !form.stock ||
      !form.category_id
    ) {
      alert("Nama, harga, stok, dan kategori wajib diisi.");
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: Number(form.category_id),
    };

    if (form.img) {
      payload.img = form.img;
    }

    try {
      setIsSaving(true);

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await addProduct(payload);
      }

      closeModal();
    } catch (error) {
      console.error(error);
      alert("Produk gagal disimpan. Periksa kembali data dan koneksi API.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus produk ini?"
    );

    if (!confirmed) return;

    try {
      await deleteProduct(id);
    } catch (error) {
      console.error(error);
      alert("Produk gagal dihapus.");
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();

    applyFilters({
      keyword: search,
      categoryId: selectedCategory,
    });
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("");
    resetFilters();
  };

  const handleLimitChange = (event) => {
    setPage(1);
    setLimit(Number(event.target.value));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-600">
              SHOPMATE / Admin
            </p>
            <h1 className="mt-2 text-2xl font-bold text-slate-800 md:text-3xl">
              Manajemen Produk
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Kelola produk, harga, stok, dan kategori toko kamu.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Tambah Produk
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Produk</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-800">
              {totalProducts}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Produk terdaftar
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Kategori</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-800">
              {categories.length}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Kategori tersedia
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Stok Halaman Ini</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-800">
              {products.reduce(
                (total, product) => total + Number(product.stock || 0),
                0
              )}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Total stok produk yang ditampilkan
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="mb-4">
              <h2 className="font-bold text-slate-800">
                Daftar Produk
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Cari dan kelola seluruh produk toko.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 lg:flex-row"
            >
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama produk..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="">Semua Kategori</option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category}
                  </option>
                ))}
              </select>

              <select
                value={limit}
                onChange={handleLimitChange}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value={2}>2 produk</option>
                <option value={5}>5 produk</option>
                <option value={10}>10 produk</option>
              </select>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Cari
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
            </form>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Memuat data produk...
            </div>
          ) : isError ? (
            <div className="p-12 text-center text-sm text-red-500">
              Gagal mengambil data produk. Periksa koneksi backend.
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-semibold text-slate-700">
                Produk tidak ditemukan
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Coba ubah kata kunci atau kategori pencarian.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Produk</th>
                      <th className="px-5 py-4 font-semibold">Kategori</th>
                      <th className="px-5 py-4 font-semibold">Harga</th>
                      <th className="px-5 py-4 font-semibold">Stok</th>
                      <th className="px-5 py-4 text-center font-semibold">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {product.img ? (
                              <img
                                src={product.img}
                                alt={product.name}
                                className="h-12 w-12 rounded-xl border border-slate-100 object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
                                No Img
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-slate-800">
                                {product.name}
                              </p>
                              <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                                {product.description || "Tidak ada deskripsi"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                            {product.category_name || product.category || "-"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          {formatRupiah(product.price)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              Number(product.stock) > 10
                                ? "bg-green-50 text-green-600"
                                : Number(product.stock) > 0
                                  ? "bg-yellow-50 text-yellow-600"
                                  : "bg-red-50 text-red-600"
                            }`}
                          >
                            {product.stock} unit
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(product)}
                              className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(product.id)}
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

              <div className="flex flex-col justify-between gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
                <p className="text-sm text-slate-500">
                  Menampilkan{" "}
                  <span className="font-semibold text-slate-700">
                    {from}-{to}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-slate-700">
                    {totalProducts}
                  </span>{" "}
                  produk
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setPage(currentPage - 1)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>

                  <span className="px-2 text-sm font-medium text-slate-600">
                    {currentPage} / {lastPage}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= lastPage}
                    onClick={() => setPage(currentPage + 1)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-6 w-full max-w-xl rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {editingId ? "Edit Produk" : "Tambah Produk"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Lengkapi informasi produk di bawah ini.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nama Produk
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama produk"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Masukkan deskripsi produk"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Kategori
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Harga
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    placeholder="Contoh: 50000"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Stok
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    placeholder="Jumlah stok"
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Gambar Produk
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
                />

                {preview && (
                  <img
                    src={preview}
                    alt="Preview produk"
                    className="mt-3 h-28 w-28 rounded-xl border border-slate-200 object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving
                    ? "Menyimpan..."
                    : editingId
                      ? "Simpan Perubahan"
                      : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
