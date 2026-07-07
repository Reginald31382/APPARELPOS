const ReceiptItems = ({ items = [] }) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.sku} className="flex justify-between">
          <div>
            <p className="font-medium">{item.name}</p>

            <p className="text-sm text-gray-500">
              {item.color} / {item.size}
            </p>

            <p className="text-sm">Qty: {item.quantity}</p>
          </div>

          <p>${(item.unitPrice * item.quantity).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default ReceiptItems;
