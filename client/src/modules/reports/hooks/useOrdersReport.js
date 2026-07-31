import { useQuery } from "@tanstack/react-query";

import { getOrdersReport } from "../services/reportService";

const useOrdersReport = (params = {}) => {
  return useQuery({
    queryKey: ["report-orders", params],
    queryFn: () => getOrdersReport(params),
  });
};

export default useOrdersReport;
