import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateOrderStatus } from "../services/orderService";

const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};

export default useUpdateOrderStatus;
