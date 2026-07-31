import { useQuery } from "@tanstack/react-query";

import { getSalesReport } from "../services/reportService";

const useSalesReport = (params = {}) => {
  return useQuery({
    queryKey: ["report-sales", params],
    queryFn: () => getSalesReport(params),
  });
};

export default useSalesReport;
