import CheckoutToolbar from "../modules/checkout/CheckoutToolbar";
import ProductGrid from "../modules/product/ProductGrid";
import CartDrawer from "../modules/cart/CartDrawer";
import CheckoutDrawer from "../modules/checkout/CheckoutDrawer";
import ProductQuickView from "../modules/product/ProductQuickView";
import ReceiptDrawer from "../modules/receipt/ReceiptDrawer";

const PosLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col">
        <CheckoutToolbar />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
          <ProductGrid />
        </div>
      </div>

      <div className="w-[420px] border-l bg-white">
        <CartDrawer />
        <ProductQuickView />
        <CheckoutDrawer />
        <ReceiptDrawer />
      </div>
    </div>
  );
};

export default PosLayout;
