import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";

// props p (product object)
export default function ProductCard({ p }) {
  const { addToCart } = useCart();

  return (
    <div
      key={p.id}
      className="border rounded-lg p-4 shadow hover:shadow-lg"
    >
      <img
        src={p.img}
        alt={p.name}
        className="w-full h-40 object-cover rounded-lg mb-4"
      />

      <h2 className="font-semibold text-lg">{p.name}</h2>

      <p className="text-gray-600 mt-1">
        Rp {p.price.toLocaleString()}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= p.rating
                ? "text-yellow-500"
                : "text-gray-300"
            }
          >
            ★
          </span>
        ))}

        <span className="text-sm text-gray-500 ml-1">
          ({p.rating}/5)
        </span>
      </div>

      <p className="text-sm text-gray-500 mt-1">
        Stok: {p.stock}
      </p>

      <Link
        to={`/product/${p.slug}`}
        state={p}
        className="text-blue-600 hover:underline mt-2 block"
      >
        Lihat Detail
      </Link>

      <button
        onClick={() => addToCart(p)}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
      >
        Add to Cart
      </button>
    </div>
  );
}