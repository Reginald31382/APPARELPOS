import { useQuery } from "@tanstack/react-query";
import { getReviewStats } from "../services/reviewService";

const useReviewStats = (productId) =>
  useQuery({
    queryKey: ["reviewStats", productId],
    queryFn: () => getReviewStats(productId),
    enabled: !!productId,
  });

export default useReviewStats;
