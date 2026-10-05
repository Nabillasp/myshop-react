import { createContext, useContext, useEffect, useState } from "react";
import { products as initialProducts } from "./data";

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("myshop_products");

    if (savedProducts) {
      return JSON.parse(savedProducts);
    }

    return initialProducts;
  });

  useEffect(() => {
    localStorage.setItem(
      "myshop_products",
      JSON.stringify(products)
    );
  }, [products]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      slug: product.name
        .toLowerCase()
        .replace(/\s+/g, "-"),
      rating: 0,
      img: `https://picsum.photos/seed/${Date.now()}/300/200`,
    };

    setProducts((currentProducts) => [
      ...currentProducts,
      newProduct,
    ]);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id
          ? {
              ...product,
              ...updatedProduct,
            }
          : product
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== id
      )
    );
  };

  const reduceStock = (cartItems) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        const cartItem = cartItems.find(
          (item) => item.id === product.id
        );

        if (!cartItem) {
          return product;
        }

        return {
          ...product,
          stock: Math.max(
            0,
            product.stock - cartItem.qty
          ),
        };
      })
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        reduceStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProduct harus digunakan di dalam ProductProvider"
    );
  }

  return context;
}