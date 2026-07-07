import useCustomers from "../../hooks/useCustomers";
import useCustomerStore from "../../store/useCustomerStore";

const CustomerDropdown = () => {
  const { data: customers = [] } = useCustomers();

  const selectCustomer = useCustomerStore((state) => state.selectCustomer);

  return (
    <div className="mt-2 rounded-lg border bg-white shadow">
      {customers.length === 0 && (
        <p className="p-3 text-gray-500">No customers found</p>
      )}

      {customers.map((customer) => (
        <button
          key={customer._id}
          onClick={() => selectCustomer(customer)}
          className="flex w-full justify-between border-b p-3 text-left hover:bg-gray-100"
        >
          <div>
            <p className="font-semibold">
              {customer.firstName} {customer.lastName}
            </p>

            <p className="text-sm text-gray-500">{customer.phone}</p>
          </div>

          <div className="text-sm">⭐ {customer.loyaltyPoints}</div>
        </button>
      ))}
    </div>
  );
};

export default CustomerDropdown;
