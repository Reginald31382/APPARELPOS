import StarRating from "../../../components/common/StarRating";

const ReviewCard = ({ review }) => {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} />

        {review.verifiedPurchase && (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            ✓ Verified Purchase
          </span>
        )}
      </div>

      {review.title && <h3 className="mt-4 font-semibold">{review.title}</h3>}

      <p className="mt-2 text-gray-600">{review.comment}</p>

      <p className="mt-4 text-sm text-gray-400">{review.customerName}</p>
    </div>
  );
};

export default ReviewCard;
