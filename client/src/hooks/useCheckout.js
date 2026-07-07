import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "../constants/queryKeys";

import { createOrder } from "../services/orderService";

const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ORDERS],
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.PRODUCTS],
      });
    },
  });
};

export default useCheckout;
