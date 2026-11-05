import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import { CartProvider } from "./utils/CartContext";
import { ProductProvider } from "./utils/ProductContext";
import { OrderProvider } from "./utils/OrderContext";
import { CategoryProvider } from "./utils/CategoryContext";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <CategoryProvider>
      <ProductProvider>
        <OrderProvider>
          <CartProvider>
            <App />
            <Toaster position="top-right" />
          </CartProvider>
        </OrderProvider>
      </ProductProvider>
    </CategoryProvider>
  </BrowserRouter>
</QueryClientProvider>
);
