import { useQuery } from "@tanstack/react-query";

import { getOrders } from "../services/orderService";

const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
};

export default useOrders;
