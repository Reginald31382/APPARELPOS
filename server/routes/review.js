import express from "express";

import {
  createReview,
  getReviews,
  getProductReviews,
  approveReview,
  getReviewStats,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getReviews);

router.get("/product/:productId", getProductReviews);

router.get("/product/:productId/stats", getReviewStats);

router.post("/", createReview);

router.patch("/:id", approveReview);

export default router;
