import CustomerSearch from "../customer/CustomerSearch";
import CustomerDropdown from "../customer/CustomerDropdown";
import CustomerCard from "../customer/CustomerCard";

import useCustomerStore from "../../store/customer/useCustomerStore.js";

const CustomerAutocomplete = () => {
  const customer = useCustomerStore((state) => state.selectedCustomer);

  const search = useCustomerStore((state) => state.search);

  if (customer) {
    return <CustomerCard />;
  }

  return (
    <div className="space-y-2">
      <CustomerSearch />

      {search.trim() && <CustomerDropdown />}
    </div>
  );
};

export default CustomerAutocomplete;
