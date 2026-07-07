import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../constants/queryKeys";

import { fetchCustomers } from "../services/customerService";

const useCustomers = (search = "") => {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS, search],

    queryFn: () => fetchCustomers(search),

    placeholderData: (previousData) => previousData,
  });
};

export default useCustomers;
