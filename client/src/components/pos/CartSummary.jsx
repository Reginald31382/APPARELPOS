import useCartStore from "../../store/useCartStore";

const CartSummary = () => {
  const items = useCartStore((state) => state.items);

  const count = items.reduce((total, item) => total + item.quantity, 0);

  const total = useCartStore((state) => state.total());

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-white px-4 py-2">
      <span className="font-semibold">🛒 {count} Items</span>

      <span className="text-lg font-bold">${total.toFixed(2)}</span>
    </div>
  );
};

export default CartSummary;
