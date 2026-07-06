import POSHeader from "../components/pos/POSHeader";
import ProductGrid from "../components/product/ProductGrid";
import CartDrawer from "../components/cart/CartDrawer";

const PosLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="flex flex-1 flex-col">
        <POSHeader />

        <div className="flex-1 overflow-y-auto bg-gray-50 p-5">
          <ProductGrid />
        </div>
      </div>

      <div className="w-[420px] border-l bg-white">
        <CartDrawer />
      </div>
    </div>
  );
};

export default PosLayout;
