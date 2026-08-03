import useProductReviews from "../hooks/useProductReviews";
import ReviewCard from "./ReviewCard";

const ProductReviews = ({ productId }) => {
  const { data: reviews = [], isLoading } = useProductReviews(productId);

  if (isLoading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        reviews.map((review) => <ReviewCard key={review._id} review={review} />)
      )}
    </div>
  );
};

export default ProductReviews;
