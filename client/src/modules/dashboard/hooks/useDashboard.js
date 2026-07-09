import { useQuery } from "@tanstack/react-query";

import { fetchDashboard } from "../services/dashboardService";

const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
  });
};

export default useDashboard;
