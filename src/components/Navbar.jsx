import { Link } from "react-router-dom";
import { useCart } from "../utils/CartContext";

export default function Navbar() {
  const { totalQty } = useCart();

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        MyShop
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-gray-200">
          Dashboard
        </Link>

        <Link
          to="/cart"
          className="hover:text-gray-200 flex items-center gap-1"
        >
          Keranjang

          {totalQty > 0 && (
            <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
              {totalQty}
            </span>
          )}
        </Link>

        <Link to="/checkout" className="hover:text-gray-200">
          Checkout
        </Link>
      </div>
    </nav>
  );
}