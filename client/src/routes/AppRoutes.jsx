import { Routes, Route } from "react-router-dom";

import Home from "../pages/customer/Home";
import Shop from "../pages/customer/Shop";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import PosLayout from "../layouts/PosLayout";
import Product from "../pages/customer/Product";
import Checkout from "../pages/customer/Checkout";
import Cart from "../pages/customer/Cart";
import CheckoutSuccess from "../pages/customer/CheckoutSuccess";

import DashboardPage from "../modules/dashboard/DashboardPage";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";
import Receipts from "../modules/receipts/pages/Receipts";
import OrderTracking from "../modules/customer/OrderTracking";
import Inventory from "../pages/admin/Inventory";
import ReportsPage from "../modules/reports/ReportsPage";
import Setup from "../pages/auth/Setup";
import Login from "../pages/auth/Login";
import Settings from "../pages/admin/Settings";
import Employees from "../pages/admin/Employees";
import ReviewPage from "../pages/ReviewPage";
import ProtectedRoute from "../modules/auth/components/ProtectedRoute";

import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer */}
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/order/:orderNumber" element={<OrderTracking />} />
        <Route path="/review/:orderId/:productId" element={<ReviewPage />} />
      </Route>

      {/* Authentication */}
      <Route path="/setup" element={<Setup />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/pos"
        element={
          <ProtectedRoute roles={["Admin", "Manager", "Employee"]}>
            <PosLayout />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["Admin", "Manager"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="receipts" element={<Receipts />} />
        <Route path="employees" element={<Employees />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
