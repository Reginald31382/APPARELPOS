import StarRating from "../../../components/common/StarRating";
import useReviewStats from "../hooks/useReviewStats";

const RatingBadge = ({ productId }) => {
  const { data } = useReviewStats(productId);

  if (!data || data.totalReviews === 0) {
    return <span className="text-sm text-gray-400">No reviews</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <StarRating rating={Math.round(data.averageRating)} size={15} />

      <span className="text-sm font-medium">
        {data.averageRating.toFixed(1)}
      </span>

      <span className="text-sm text-gray-500">({data.totalReviews})</span>
    </div>
  );
};

export default RatingBadge;
