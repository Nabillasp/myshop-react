import { useProduct } from "../../utils/ProductContext";

const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function AdminDashboard() {
  const { products, isLoading, isError } = useProduct();

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum, product) => sum + Number(product.stock || 0),
    0
  );
  const totalCategories = new Set(
    products.map((product) => product.category_name).filter(Boolean)
  ).size;
  const totalValue = products.reduce(
    (sum, product) =>
      sum + Number(product.price || 0) * Number(product.stock || 0),
    0
  );

  const stats = [
    {
      title: "Total Produk",
      value: totalProducts,
      subtitle: "Produk terdaftar",
      icon: "▣",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Persediaan",
      value: totalStock.toLocaleString("id-ID"),
      subtitle: "Unit tersedia",
      icon: "▤",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Kategori Produk",
      value: totalCategories,
      subtitle: "Kategori aktif",
      icon: "▦",
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Nilai Persediaan",
      value: formatRupiah(totalValue),
      subtitle: "Estimasi nilai stok",
      icon: "Rp",
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const lowStockProducts = products.filter(
    (product) => Number(product.stock) <= 5
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold tracking-wide text-blue-600">
            OVERVIEW
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Selamat datang kembali di panel manajemen SHOPMATE.
          </p>
        </div>

        <a
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + Tambah Produk
        </a>
      </section>

      {isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Memuat data produk...
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          Data produk gagal dimuat. Periksa koneksi API.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400">
                  {stat.subtitle}
                </p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">
                    Ringkasan Persediaan
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Kondisi stok produk saat ini
                  </p>
                </div>
                <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600">
                  INVENTORY
                </span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Stok tersedia</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {products.filter((p) => Number(p.stock) > 5).length}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Produk dengan stok di atas 5
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-5">
                  <p className="text-sm text-orange-700">Stok menipis</p>
                  <p className="mt-2 text-3xl font-bold text-orange-800">
                    {lowStockProducts}
                  </p>
                  <p className="mt-1 text-xs text-orange-600">
                    Produk dengan stok 5 atau kurang
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs text-slate-500">
                  <span>Komposisi stok</span>
                  <span>{totalProducts} produk</span>
                </div>
                <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="bg-blue-600 transition-all"
                    style={{
                      width: `${totalProducts ? ((totalProducts - lowStockProducts) / totalProducts) * 100 : 0}%`,
                    }}
                  />
                  <div
                    className="bg-orange-400 transition-all"
                    style={{
                      width: `${totalProducts ? (lowStockProducts / totalProducts) * 100 : 0}%`,
                    }}
                  />
                </div>
                <div className="mt-3 flex gap-5 text-xs text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                    Stok normal
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-400" />
                    Stok menipis
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl">
                S
              </div>
              <p className="mt-7 text-sm font-medium text-slate-400">
                SHOPMATE STORE
              </p>
              <h3 className="mt-2 text-2xl font-bold">
                Kelola toko lebih mudah.
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Pantau produk, persediaan, dan aktivitas toko melalui satu
                dashboard terintegrasi.
              </p>
              <a
                href="/admin/products"
                className="mt-6 inline-flex rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-blue-50"
              >
                Buka Manajemen Produk →
              </a>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-slate-900">
                  Daftar Produk
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Ringkasan produk terbaru dari database.
                </p>
              </div>
              <a
                href="/admin/products"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Lihat semua →
              </a>
            </div>

            {products.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                Belum ada produk yang tersedia.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <th className="px-6 py-4">Nama Produk</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Harga</th>
                      <th className="px-6 py-4">Stok</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.slice(0, 5).map((product) => (
                      <tr key={product.id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                              {product.img ? (
                                <img
                                  src={product.img}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-lg text-slate-400">▣</span>
                              )}
                            </div>
                            <span className="text-sm font-semibold text-slate-800">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {product.category_name || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700">
                          {formatRupiah(product.price)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            Number(product.stock) > 5
                              ? "bg-emerald-50 text-emerald-700"
                              : Number(product.stock) > 0
                                ? "bg-orange-50 text-orange-700"
                                : "bg-red-50 text-red-700"
                          }`}>
                            {Number(product.stock) > 5
                              ? "Tersedia"
                              : Number(product.stock) > 0
                                ? "Stok Menipis"
                                : "Habis"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
