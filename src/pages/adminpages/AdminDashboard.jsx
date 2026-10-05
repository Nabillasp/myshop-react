import { useProduct } from "../../utils/ProductContext";

export default function AdminDashboard() {
  const { products } = useProduct();

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  const totalCategories = new Set(
    products.map((product) => product.category_name)
  ).size;

  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Produk</p>
          <h2 className="text-3xl font-bold mt-2">
            {totalProducts}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Stok</p>
          <h2 className="text-3xl font-bold mt-2">
            {totalStock}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Total Kategori</p>
          <h2 className="text-3xl font-bold mt-2">
            {totalCategories}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-500">Nilai Stok</p>
          <h2 className="text-xl font-bold mt-2">
            Rp {totalValue.toLocaleString()}
          </h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Daftar Produk
          </h2>

          <span className="text-sm text-gray-500">
            {totalProducts} produk
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
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
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