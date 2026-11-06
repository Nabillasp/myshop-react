
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProduct } from "../../utils/ProductContext";
import { useCategory } from "../../utils/CategoryContext";

export default function ProductForm() {
  const navigate = useNavigate();
  const { addProduct } = useProduct();
  const { categories } = useCategory();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    img: null,
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, img: e.target.files[0] || null }));
    setErrors((prev) => ({ ...prev, img: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSaving(true);

    try {
      await addProduct(form);
      toast.success("Produk berhasil ditambahkan!");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } catch (error) {
      const validationErrors = error.response?.data?.errors;

      if (validationErrors) {
        setErrors(validationErrors);
        toast.error("Periksa kembali data produk.");
      } else {
        toast.error(
          error.response?.data?.message || "Gagal menambahkan produk."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const fieldError = (name) =>
    errors[name]?.[0] || "";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          Tambah Produk
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Masukkan informasi produk baru ke dalam SHOPMATE.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-medium">
            Nama Produk
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
          {fieldError("name") && (
            <p className="mt-1 text-sm text-red-500">{fieldError("name")}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Deskripsi
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
          {fieldError("description") && (
            <p className="mt-1 text-sm text-red-500">{fieldError("description")}</p>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Harga
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
            {fieldError("price") && (
              <p className="mt-1 text-sm text-red-500">{fieldError("price")}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Stok
            </label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            />
            {fieldError("stock") && (
              <p className="mt-1 text-sm text-red-500">{fieldError("stock")}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Kategori
          </label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          >
            <option value="">Pilih kategori</option>
            {categories?.map((category) => (
              <option
                key={category.category_id || category.id}
                value={category.category_id || category.id}
              >
                {category.category}
              </option>
            ))}
          </select>
          {fieldError("category_id") && (
            <p className="mt-1 text-sm text-red-500">{fieldError("category_id")}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Gambar Produk
          </label>
          <input
            type="file"
            name="img"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />
          {fieldError("img") && (
            <p className="mt-1 text-sm text-red-500">{fieldError("img")}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="rounded-lg border border-slate-300 px-5 py-3 text-slate-600"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </div>
      </form>
    </div>
  );
}
