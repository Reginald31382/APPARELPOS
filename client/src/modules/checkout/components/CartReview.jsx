import useCartStore from "../../../store/cart/useCartStore";

const CartReview = () => {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-4">
        <h3 className="mb-3 text-lg font-semibold">Cart</h3>

        <p className="text-gray-500">No items in cart.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-4 text-lg font-semibold">Cart Items</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.sku}
            className="flex gap-4 border-b pb-4 last:border-b-0"
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-20 rounded-lg object-cover border"
            />

            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>

              <p className="text-sm text-gray-500">
                {item.color} • {item.size}
              </p>

              <p className="text-sm">Qty: {item.quantity}</p>

              <p className="text-sm">${item.unitPrice.toFixed(2)} each</p>
            </div>

            <div className="text-right font-semibold">
              ${(item.unitPrice * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartReview;
