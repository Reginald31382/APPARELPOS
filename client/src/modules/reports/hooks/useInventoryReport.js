import { useQuery } from "@tanstack/react-query";

import { getInventoryReport } from "../services/reportService";

const useInventoryReport = (params = {}) => {
  return useQuery({
    queryKey: ["report-inventory", params],
    queryFn: () => getInventoryReport(params),
  });
};

export default useInventoryReport;
