import { useMutation, useQueryClient } from "@tanstack/react-query";

import { refundOrder } from "../../../services/refundService";

const useRefundOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }) => refundOrder(orderId, reason),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

export default useRefundOrder;
