import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStore } from "../storeService";

const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStore,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["store"],
      });
    },
  });
};

export default useUpdateStore;
