import { Link } from "react-router-dom";
import useMobileCartStore from "../store/ui/useMobileCartStore";
import DesktopCartToggle from "../modules/cart/DesktopCartToggle";
import CheckoutToolbar from "../modules/checkout/components/CheckoutToolbar";
import ProductGrid from "../modules/product/ProductGrid";

import CartDrawer from "../modules/cart/CartDrawer";
import CheckoutDrawer from "../modules/checkout/components/CheckoutDrawer";
import ReceiptDrawer from "../modules/receipt/ReceiptDrawer";
import ProductQuickView from "../modules/product/ProductQuickView";
import FloatingCartButton from "../modules/cart/FloatingCartButton";
import { AiTwotoneHome } from "react-icons/ai";

const PosLayout = () => {
  const isDesktopCollapsed = useMobileCartStore(
    (state) => state.isDesktopCollapsed,
  );
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <Link to="/" className="p-3 text-3xl font-bold fixed right-0">
        <AiTwotoneHome />
      </Link>
      {/* Product Area */}
      <div className="flex flex-1 flex-col">
        <h1 className="p-3 text-3xl font-bold ">POS J.Rome Checkout Systems</h1>
        <CheckoutToolbar />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-5 lg:p-6">
          <ProductGrid />
        </div>
      </div>

      {/* Desktop Cart */}
      <aside
        className={`
    hidden overflow-hidden border-l bg-white transition-all duration-300 ease-in-out lg:block
    ${isDesktopCollapsed ? "w-0 border-l-0" : "w-[420px]"}
  `}
      >
        <div
          className={`
      h-full w-[420px] transition-transform duration-300 ease-in-out
      ${isDesktopCollapsed ? "translate-x-full" : "translate-x-0"}
    `}
        >
          <CartDrawer />
        </div>
      </aside>

      {/* Mobile Cart */}
      <div className="lg:hidden">
        <CartDrawer />
      </div>

      {/* POS Panels */}
      <ProductQuickView />
      <CheckoutDrawer />
      <ReceiptDrawer />

      <DesktopCartToggle />

      {/* Floating Cart */}
      <FloatingCartButton />
    </div>
  );
};

export default PosLayout;
