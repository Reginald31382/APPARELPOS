import useCustomerStore from "../../../store/customer/useCustomerStore";

const CustomerSummary = () => {
  const customer = useCustomerStore((state) => state.selectedCustomer);

  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="mb-3 text-lg font-semibold">Customer</h3>

      {customer ? (
        <>
          <p className="font-semibold">
            👤 {customer.firstName} {customer.lastName}
          </p>

          <p className="text-sm text-gray-500">
            {customer.phone || "No phone"}
          </p>

          <p className="text-sm text-gray-500">
            {customer.email || "No email"}
          </p>

          <p className="mt-2 text-sm font-medium text-blue-600">
            ⭐ {customer.loyaltyPoints} Loyalty Points
          </p>
        </>
      ) : (
        <>
          <p className="font-semibold">🚶 Walk-in Customer</p>

          <p className="text-sm text-gray-500">No customer attached</p>
        </>
      )}
    </div>
  );
};

export default CustomerSummary;
