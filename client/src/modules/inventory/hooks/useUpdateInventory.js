import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateInventory } from "../../../modules/inventory/services/inventoryService";

const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sku, quantity }) => updateInventory({ sku, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
};

export default useUpdateInventory;
