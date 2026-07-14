import { useQuery } from "@tanstack/react-query";

import { getInventoryHistory } from "../services/historyService";

const useInventoryHistory = () => {
  return useQuery({
    queryKey: ["inventory-history"],
    queryFn: getInventoryHistory,
  });
};

export default useInventoryHistory;
