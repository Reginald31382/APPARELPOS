import { useQuery } from "@tanstack/react-query";

import { getReportSummary } from "../services/reportService";

const useReportSummary = (params = {}) => {
  return useQuery({
    queryKey: ["report-summary", params],
    queryFn: () => getReportSummary(params),
  });
};

export default useReportSummary;
