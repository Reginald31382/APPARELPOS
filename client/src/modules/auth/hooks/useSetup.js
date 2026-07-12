import { useQuery } from "@tanstack/react-query";
import { hasUsers } from "../services/setupService";

const useSetup = () => {
  return useQuery({
    queryKey: ["setup"],
    queryFn: hasUsers,
  });
};

export default useSetup;
