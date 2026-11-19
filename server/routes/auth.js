import express from "express";

import {
  login,
  register,
  hasUsers,
  managerOverride,
  getRecoveryQuestions,
  verifyRecoveryAnswers,
  resetPassword,
} from "../controllers/authController.js";

import {
  recoveryQuestionsLimiter,
  recoveryVerifyLimiter,
  recoveryResetLimiter,
} from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/has-users", hasUsers);

router.post("/register", register);

router.post("/login", login);

router.post("/override", managerOverride);

// Security-question password recovery
router.post(
  "/recovery/questions",
  recoveryQuestionsLimiter,
  getRecoveryQuestions,
);

router.post("/recovery/verify", recoveryVerifyLimiter, verifyRecoveryAnswers);

router.post("/recovery/reset-password", recoveryResetLimiter, resetPassword);

export default router;
