import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "../services/reviewService";

const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });
    },
  });
};

export default useCreateReview;
