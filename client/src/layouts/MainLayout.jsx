import { Outlet } from "react-router-dom";
import AnnouncementBar from "../components/layout/AnnouncementBar";
import StoreNavbar from "../components/layout/StoreNavbar";
import CartDrawer from "../modules/cart/CartDrawer";
import ProductQuickView from "../modules/product/ProductQuickView";
import StoreCartModal from "../modules/cart/StoreCartModal";
// import Footer from "../components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AnnouncementBar />
      <StoreNavbar />
      <div className="flex">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <StoreCartModal />
      <ProductQuickView />
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
