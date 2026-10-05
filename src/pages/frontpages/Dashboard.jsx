import { useOutletContext } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { useProduct } from "../../utils/ProductContext";

export default function Dashboard() {
  const { search, category } = useOutletContext();
  const { products } = useProduct();

  const filteredProducts = products.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "Semua Kategori" ||
      item.category_name === category;

    return matchSearch && matchCategory;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Dashboard Produk
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">
          Produk tidak ditemukan.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((item) => (
            <ProductCard
              p={item}
              key={item.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}