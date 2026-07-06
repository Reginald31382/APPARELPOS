import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateInventory } from "../services/inventoryService";

const useInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInventory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

export default useInventory;
