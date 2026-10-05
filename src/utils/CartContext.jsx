import { createContext, useContext, useState } from "react";
import { useProduct } from "./ProductContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const {
    products,
    updateProduct,
  } = useProduct();

  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const currentProduct = products.find(
      (item) => item.id === product.id
    );

    if (!currentProduct || currentProduct.stock <= 0) {
      alert("Stok produk habis.");
      return;
    }

    const existing = cart.find(
      (item) => item.id === product.id
    );

    if (existing && existing.qty >= currentProduct.stock) {
      alert("Jumlah produk melebihi stok.");
      return;
    }

    setCart((prev) => {
      const existingItem = prev.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          qty: 1,
        },
      ];
    });
  };

  const updateQty = (id, qty) => {
    const product = products.find(
      (item) => item.id === id
    );

    if (!product) {
      return;
    }

    const newQty = Math.max(
      1,
      Math.min(qty, product.stock)
    );

    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: newQty,
            }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const totalQty = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        totalQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () =>
  useContext(CartContext);