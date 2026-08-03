import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../services/reviewService";

const useReviews = () =>
  useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
  });

export default useReviews;
