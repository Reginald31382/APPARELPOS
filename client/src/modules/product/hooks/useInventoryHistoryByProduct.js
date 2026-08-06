import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";

const useInventoryHistoryByProduct = (productId) => {
  return useQuery({
    queryKey: ["inventory-history", productId],
    enabled: !!productId,

    queryFn: async () => {
      const { data } = await api.get(`/inventory/history/${productId}`);

      return data;
    },
  });
};

export default useInventoryHistoryByProduct;
