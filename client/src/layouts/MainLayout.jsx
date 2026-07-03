import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CartDrawer from "../components/cart/CartDrawer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex">
        <main className="flex-1">
          <Outlet />
        </main>

        <CartDrawer />
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;
