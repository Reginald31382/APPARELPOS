import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import useCustomerStore from "../../store/useCustomerStore";

const fetchCustomers = async (search) => {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  const res = await api.get(`/customers?${params.toString()}`);

  return res.data;
};

const useCustomers = () => {
  const search = useCustomerStore((state) => state.search);

  return useQuery({
    queryKey: ["customers", search],

    queryFn: () => fetchCustomers(search),

    placeholderData: (previousData) => previousData,
  });
};

export default useCustomers;
