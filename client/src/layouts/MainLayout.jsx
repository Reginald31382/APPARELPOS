import { Outlet, useLocation } from "react-router-dom";
import AnnouncementBar from "../components/layout/AnnouncementBar";
import StoreNavbar from "../components/layout/StoreNavbar";
import StoreCartModal from "../modules/cart/StoreCartModal";
import Footer from "../components/layout/Footer";

import NewsletterModal from "../modules/newsletter/components/NewsletterModal";
import useNewsletterStore from "../store/ui/useNewsletterStore";

const MainLayout = () => {
  const location = useLocation();
  const open = useNewsletterStore((state) => state.open);
  const closeModal = useNewsletterStore((state) => state.closeModal);

  const isHomePage = location.pathname === "/";
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
      <NewsletterModal open={open} onClose={closeModal} />
      {isHomePage && <Footer />}
    </div>
  );
};

export default MainLayout;
