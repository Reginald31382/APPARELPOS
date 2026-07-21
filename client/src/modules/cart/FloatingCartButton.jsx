import { GiShoppingCart } from "react-icons/gi";

import useCartStore from "../../store/cart/useCartStore";
import useMobileCartStore from "../../store/ui/useMobileCartStore";

const FloatingCartButton = () => {
  const items = useCartStore((state) => state.items);

  const openCart = useMobileCartStore((state) => state.openCart);

  const handleClick = () => {
    // console.log("Opening cart...");
    openCart();
  };

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  if (count === 0) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:scale-105 lg:hidden"
    >
      <GiShoppingCart size={28} />

      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
        {count}
      </span>
    </button>
  );
};

export default FloatingCartButton;
