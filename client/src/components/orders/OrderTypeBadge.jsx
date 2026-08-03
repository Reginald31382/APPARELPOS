const OrderTypeBadge = ({ type }) => {
  if (type === "POS") {
    return (
      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
        POS
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
      ONLINE
    </span>
  );
};

export default OrderTypeBadge;
