import { useQuery } from "@tanstack/react-query";
import { getStore } from "../storeService";

const useStore = () => {
  return useQuery({
    queryKey: ["store"],
    queryFn: getStore,
  });
};

export default useStore;
