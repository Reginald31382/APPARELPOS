import useCustomerStore from "../../store/customer/useCustomerStore";

const CustomerCard = () => {
  const customer = useCustomerStore((state) => state.selectedCustomer);

  const clearCustomer = useCustomerStore((state) => state.clearCustomer);

  if (!customer) return null;

  return (
    <div className="rounded-lg border bg-blue-50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">
            {customer.firstName} {customer.lastName}
          </h3>

          <p className="text-sm">{customer.phone}</p>

          <p className="text-sm">⭐ {customer.loyaltyPoints} Points</p>
        </div>

        <button
          onClick={clearCustomer}
          className="rounded bg-red-500 px-3 py-1 text-white"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CustomerCard;
