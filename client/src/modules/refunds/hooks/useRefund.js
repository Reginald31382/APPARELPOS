import { useMutation, useQueryClient } from "@tanstack/react-query";

import { refundOrder } from "../services/refundService";

const useRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refundOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

export default useRefund;
