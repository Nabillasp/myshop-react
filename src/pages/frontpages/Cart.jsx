import { Link } from "react-router-dom";
import { useCart } from "../../utils/CartContext";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Your Cart</h1>
        <p className="text-gray-600">Cart is empty</p>

        <Link
          to="/"
          className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Kembali Belanja
        </Link>
      </div>
    );
  }

  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between border p-4 rounded-lg shadow-sm gap-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.img}
                alt={item.name}
                className="w-20 h-20 rounded-md object-cover"
              />

              <div>
                <h2 className="font-semibold">{item.name}</h2>

                <p className="text-gray-600">
                  Rp {item.price.toLocaleString()}
                </p>

                <p className="text-sm text-gray-500">
                  Subtotal: Rp{" "}
                  {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                value={item.qty}
                min="1"
                className="w-16 border rounded text-center"
                onChange={(e) =>
                  updateQty(
                    item.id,
                    parseInt(e.target.value) || 1
                  )
                }
              />

              <button
                onClick={() => removeFromCart(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ringkasan Cart */}
      <div className="mt-6 border rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-bold mb-4">
          Ringkasan Belanja
        </h2>

        <div className="flex justify-between mb-2">
          <span>Total Item</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between text-lg font-bold">
          <span>Total Harga</span>
          <span>Rp {totalPrice.toLocaleString()}</span>
        </div>

        <Link
          to="/checkout"
          className="block text-center mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Lanjut ke Checkout
        </Link>
      </div>
    </div>
  );
}