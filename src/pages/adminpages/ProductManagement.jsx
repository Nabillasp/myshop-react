import { useState } from "react";
import { useProduct } from "../../utils/ProductContext";

export default function ProductManagement() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProduct();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [editingId, setEditingId] = useState(null);

  const getCategoryId = (categoryName) => {
    if (categoryName === "Electronics") {
      return 1;
    }

    if (categoryName === "Fashion") {
      return 2;
    }

    return 3;
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setCategory("Electronics");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !price || !stock) {
      alert("Semua data produk harus diisi.");
      return;
    }

    const productData = {
      name,
      price: Number(price),
      stock: Number(stock),
      category: getCategoryId(category),
      category_name: category,
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setCategory(product.category_name);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus produk ini?"
    );

    if (confirmDelete) {
      deleteProduct(id);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Product Management
          </h1>

          <p className="text-gray-500 mt-1">
            Kelola data produk toko
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setName("");
            setPrice("");
            setStock("");
            setCategory("Electronics");
            setShowForm(true);
          }}
          className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          + Tambah Produk
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Produk" : "Tambah Produk"}
            </h2>

            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-800 text-xl"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block font-medium mb-2">
                Nama Produk
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Laptop"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Harga
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Contoh: 500000"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Stok
              </label>

              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Contoh: 10"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Kategori
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Kecantikan</option>
              </select>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {editingId ? "Update Produk" : "Simpan Produk"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Daftar Produk
          </h2>

          <span className="text-sm text-gray-500">
            {products.length} produk
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">
                  Produk
                </th>

                <th className="border p-3 text-left">
                  Kategori
                </th>

                <th className="border p-3 text-left">
                  Harga
                </th>

                <th className="border p-3 text-left">
                  Stok
                </th>

                <th className="border p-3 text-left">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border p-3">
                    {product.name}
                  </td>

                  <td className="border p-3">
                    {product.category_name}
                  </td>

                  <td className="border p-3">
                    Rp {product.price.toLocaleString()}
                  </td>

                  <td className="border p-3">
                    {product.stock}
                  </td>

                  <td className="border p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(product.id)
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="border p-6 text-center text-gray-500"
                  >
                    Belum ada produk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}