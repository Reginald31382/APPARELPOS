import useCartStore from "../../store/cart/useCartStore";
import useMobileCartStore from "../../store/ui/useMobileCartStore";

import { formatCurrency } from "../../utils/currency";

const DesktopCartToggle = () => {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);

  const isDesktopCollapsed = useMobileCartStore(
    (state) => state.isDesktopCollapsed,
  );

  const toggleDesktopCart = useMobileCartStore(
    (state) => state.toggleDesktopCart,
  );

  if (!isDesktopCollapsed) return null;

  return (
    <button
      onClick={toggleDesktopCart}
      className="
        fixed
        right-0
        top-1/2
        z-50
        hidden
        -translate-y-1/2

        w-40

        rounded-l-2xl
        bg-gray-900

        px-4
        py-4

        text-left
        text-white

        shadow-2xl

        transition-all
        duration-300

        hover:w-44
        hover:bg-black

        lg:block
      "
    >
      <div className="text-2xl">🛒</div>

      <div className="mt-2 text-sm text-gray-300">
        {items.length} {items.length === 1 ? "Item" : "Items"}
      </div>

      <div className="mt-1 text-xl font-bold">{formatCurrency(total())}</div>
    </button>
  );
};

export default DesktopCartToggle;
