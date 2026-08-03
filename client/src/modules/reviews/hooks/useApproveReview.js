import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveReview } from "../services/reviewService";

const useApproveReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveReview,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });
};

export default useApproveReview;
