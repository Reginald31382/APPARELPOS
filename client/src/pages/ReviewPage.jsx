import { useParams } from "react-router-dom";

import ReviewForm from "../modules/reviews/components/ReviewForm";
import useOrder from "../modules/orders/hooks/useOrders";

const ReviewPage = () => {
  const { orderId, productId } = useParams();

  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!order) {
    return <div className="p-10 text-center">Order not found.</div>;
  }

  const product = order.items.find(
    (item) => item.productId.toString() === productId,
  );
  if (!product) {
    return <div className="p-10 text-center">Product not found.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl py-10">
      <ReviewForm
        order={order._id}
        product={product.productId}
        customerName={`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}
      />
    </div>
  );
};

export default ReviewPage;
