import CheckoutToolbar from "../modules/checkout/components/CheckoutToolbar";
import ProductGrid from "../modules/product/ProductGrid";

import CartDrawer from "../modules/cart/CartDrawer";
import CheckoutDrawer from "../modules/checkout/components/CheckoutDrawer";
import ReceiptDrawer from "../modules/receipt/ReceiptDrawer";

import ProductQuickView from "../modules/product/ProductQuickView";
import FloatingCartButton from "../modules/cart/FloatingCartButton";

const PosLayout = () => {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Product Area */}
      <div className="flex flex-1 flex-col">
        <CheckoutToolbar />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-5 lg:p-6">
          <ProductGrid />
        </div>
      </div>

      {/* Desktop Cart */}
      <aside className="hidden w-[420px] shrink-0 border-l bg-white lg:block">
        <CartDrawer />
      </aside>

      {/* Mobile Cart */}
      <div className="lg:hidden">
        <CartDrawer />
      </div>

      {/* POS Panels */}
      <ProductQuickView />
      <CheckoutDrawer />
      <ReceiptDrawer />

      {/* Floating Cart */}
      <FloatingCartButton />
    </div>
  );
};

export default PosLayout;
