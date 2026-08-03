import { useQuery } from "@tanstack/react-query";
import { getProductReviews } from "../services/reviewService";

const useProductReviews = (productId) =>
  useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  });

export default useProductReviews;
