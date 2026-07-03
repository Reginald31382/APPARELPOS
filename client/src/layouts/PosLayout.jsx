import ProductGrid from "../components/product/ProductGrid";
import CartDrawer from "../components/cart/CartDrawer";

const PosLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT - PRODUCTS */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <ProductGrid />
      </div>

      {/* RIGHT - SINGLE CART ONLY */}
      <div className="w-[420px] border-l bg-white">
        <CartDrawer />
      </div>
    </div>
  );
};

export default PosLayout;
