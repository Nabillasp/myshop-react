import { useOrder } from "../../utils/OrderContext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../utils/CartContext";
import { useProduct } from "../../utils/ProductContext";


export default function Checkout() {
  const { cart, removeFromCart } = useCart();
  const { reduceStock } = useProduct();
  const { addOrder } = useOrder();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("Transfer Bank");
  const [submitted, setSubmitted] = useState(false);

  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !address.trim()) {
      alert("Nama dan alamat harus diisi.");
      return;
    }

    addOrder({
        customerName: name,
        address,
        payment,
        items: cart,
        totalItems,
        totalPrice,
    });

    reduceStock(cart);

    cart.forEach((item) => {
      removeFromCart(item.id);
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="text-5xl mb-4">
            ✓
          </div>

          <h1 className="text-2xl font-bold text-green-700 mb-3">
            Pesanan Berhasil!
          </h1>

          <p className="text-gray-600 mb-2">
            Terima kasih, {name}.
          </p>

          <p className="text-gray-600 mb-2">
            Pesanan kamu sedang diproses.
          </p>

          <p className="text-gray-600 mb-6">
            Total pembayaran:{" "}
            <span className="font-bold">
              Rp {totalPrice.toLocaleString()}
            </span>
          </p>

          <Link
            to="/"
            className="inline-block px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-3">
          Checkout
        </h1>

        <p className="text-gray-500 mb-4">
          Belum ada produk untuk checkout.
        </p>

        <Link
          to="/"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">
            Data Pembeli
          </h2>

          <form onSubmit={handleSubmit}>
            <label className="block font-medium mb-2">
              Nama
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Masukkan nama"
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <label className="block font-medium mb-2">
              Alamat
            </label>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Masukkan alamat"
              rows="4"
              className="w-full border rounded-lg px-4 py-2 mb-4"
            />

            <label className="block font-medium mb-2">
              Metode Pembayaran
            </label>

            <select
              value={payment}
              onChange={(e) =>
                setPayment(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-2 mb-6"
            >
              <option>Transfer Bank</option>
              <option>COD</option>
              <option>E-Wallet</option>
            </select>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Buat Pesanan
            </button>
          </form>
        </div>

        <div className="border rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">
            Ringkasan Pesanan
          </h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b pb-3"
              >
                <div>
                  <p className="font-medium">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.qty} × Rp{" "}
                    {item.price.toLocaleString()}
                  </p>
                </div>

                <p className="font-medium">
                  Rp{" "}
                  {(item.price * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span>Total Item</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total Harga</span>

              <span>
                Rp {totalPrice.toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Pembayaran: {payment}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}