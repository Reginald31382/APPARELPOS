const PaymentMethodBadge = ({ method }) => {
  const styles = {
    Cash: "bg-green-100 text-green-700",
    Card: "bg-blue-100 text-blue-700",
    Stripe: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[method] || "bg-gray-100 text-gray-700"
      }`}
    >
      {method}
    </span>
  );
};

export default PaymentMethodBadge;
