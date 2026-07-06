import CustomerSearch from "./CustomerSearch";
import CustomerDropdown from "./CustomerDropdown";
import CustomerCard from "./CustomerCard";

import useCustomerStore from "../../store/useCustomerStore";

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
