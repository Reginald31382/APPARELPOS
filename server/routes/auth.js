import express from "express";

import {
  login,
  register,
  hasUsers,
  managerOverride,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/has-users", hasUsers);

router.post("/register", register);

router.post("/login", login);

router.post("/override", managerOverride);

export default router;
