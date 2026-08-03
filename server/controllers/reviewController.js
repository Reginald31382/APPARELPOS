import Review from "../models/Review.js";
import Order from "../models/Order.js";

/*
POST /api/reviews
*/

export const createReview = async (req, res) => {
  try {
    const { product, order, customerName, rating, title, comment } = req.body;

    const existingOrder = await Order.findById(order);

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const alreadyReviewed = await Review.findOne({
      order,
      product,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You have already reviewed this product.",
      });
    }

    const review = await Review.create({
      product,
      order,
      customerName,
      rating,
      title,
      comment,
      verifiedPurchase: true,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
GET /api/reviews/product/:productId
*/

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      approved: true,
    }).sort({
      createdAt: -1,
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
GET /api/reviews
*/

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("product", "name").sort({
      createdAt: -1,
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
PATCH /api/reviews/:id
*/

export const approveReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      message: "Review not found",
    });
  }

  review.approved = true;

  await review.save();

  res.json(review);
};

/*
GET /api/reviews/product/:productId/stats
*/

export const getReviewStats = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      approved: true,
    });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews;

    res.json({
      averageRating,
      totalReviews,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
