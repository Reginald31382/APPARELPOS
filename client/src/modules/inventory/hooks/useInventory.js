import { useQuery } from "@tanstack/react-query";

import { getInventory } from "../services/inventoryService";

const useInventory = () => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: getInventory,
  });
};

export default useInventory;
