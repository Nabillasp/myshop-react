import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../../utils/CartContext";

export default function ProductDetail() {
  const location = useLocation();
  const p = location.state;

  const { addToCart } = useCart();

  // State untuk rating dan review
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!rating || !review.trim()) return;

    const newReview = {
      id: Date.now(),
      rating,
      review,
    };

    setReviews([...reviews, newReview]);

    setRating(0);
    setReview("");
  };

  if (!p) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Produk tidak ditemukan
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Informasi Produk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 shadow">
          <img
            src={p.img}
            alt={p.name}
            className="w-full h-80 object-cover rounded-lg"
          />
        </div>

        <div className="border rounded-lg p-6 shadow">
          <h1 className="text-3xl font-bold mb-3">
            {p.name}
          </h1>

          <p className="text-2xl font-semibold text-blue-600 mb-3">
            Rp {p.price.toLocaleString()}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  star <= p.rating
                    ? "text-yellow-500 text-xl"
                    : "text-gray-300 text-xl"
                }
              >
                ★
              </span>
            ))}

            <span className="text-gray-500 ml-2">
              ({p.rating}/5)
            </span>
          </div>

          <p className="text-gray-600 mb-4">
            Kategori: {p.category_name}
          </p>

          <p className="text-gray-600 mb-6">
            Stok tersedia: {p.stock}
          </p>

          <button
            onClick={() => addToCart(p)}
            className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Review */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">
            User Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500">
              Belum ada review.
            </p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                >
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= r.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-700">
                    {r.review}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Form Review */}
        <section className="border rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">
            Berikan Review
          </h2>

          <form onSubmit={handleSubmit}>
            <label className="block font-medium mb-2">
              Rating:
            </label>

            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <label className="block font-medium mb-2">
              Review:
            </label>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
              rows="4"
              placeholder="Tulis pengalaman Anda..."
            />

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Submit Review
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}