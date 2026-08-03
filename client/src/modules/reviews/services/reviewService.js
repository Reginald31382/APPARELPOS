import api from "../../../api/axios";

export const createReview = async (review) => {
  const { data } = await api.post("/reviews", review);
  return data;
};

export const getProductReviews = async (productId) => {
  const { data } = await api.get(`/reviews/product/${productId}`);
  return data;
};

export const getReviews = async () => {
  const { data } = await api.get("/reviews");
  return data;
};

export const approveReview = async (id) => {
  const { data } = await api.patch(`/reviews/${id}`);
  return data;
};

export const getReviewStats = async (productId) => {
  const { data } = await api.get(`/reviews/product/${productId}/stats`);

  return data;
};
