import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/frontpages/Dashboard";
import ProductDetail from "./pages/frontpages/ProductDetail";
import Cart from "./pages/frontpages/Cart";
import Checkout from "./pages/frontpages/Checkout";
import OrderManagement from "./pages/adminpages/OrderManagement";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/adminpages/AdminDashboard";
import ProductManagement from "./pages/adminpages/ProductManagement.jsx";
import AboutPage from "./pages/adminpages/AboutPage";
import CategoryManagement from "./pages/adminpages/CategoryManagement";
import Login from "./pages/Login";
import ProductForm from "./pages/adminpages/ProductForm";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="products/create" element={<ProductForm />} />
      </Route>
    </Routes>
  );
}
