import { useQuery } from "@tanstack/react-query";

import { getInventoryHistory } from "@/modules/inventory/services/historyService";

const useInventoryHistory = () => {
  return useQuery({
    queryKey: ["inventory-history"],
    queryFn: getInventoryHistory,
  });
};

export default useInventoryHistory;
