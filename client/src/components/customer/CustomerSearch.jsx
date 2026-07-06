import useCustomerStore from "../../store/useCustomerStore";

const CustomerSearch = () => {
  const search = useCustomerStore((state) => state.search);

  const setSearch = useCustomerStore((state) => state.setSearch);

  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search customer..."
      className="w-full rounded-lg border p-3"
    />
  );
};

export default CustomerSearch;
