import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../constants/queryKeys";

import { fetchOrders } from "../services/orderService";

const useOrders = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS],

    queryFn: fetchOrders,

    placeholderData: (previousData) => previousData,
  });
};

export default useOrders;
