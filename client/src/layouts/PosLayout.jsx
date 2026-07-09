import CheckoutToolbar from "../modules/checkout/components/CheckoutToolbar";
import ProductGrid from "../modules/product/ProductGrid";

import RightPanel from "../modules/panel/RightPanel";

import ProductQuickView from "../modules/product/ProductQuickView";
import FloatingCartButton from "../modules/cart/FloatingCartButton";

const PosLayout = () => {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <div className="flex flex-1 flex-col">
        <CheckoutToolbar />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-5 lg:p-6">
          <ProductGrid />
        </div>
      </div>

      <RightPanel />

      <ProductQuickView />

      <FloatingCartButton />
    </div>
  );
};

export default PosLayout;
