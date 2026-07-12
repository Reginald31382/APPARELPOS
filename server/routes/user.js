import express from "express";

import { getUsers } from "../controllers/userController.js";

import { createUser } from "../controllers/userController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("Admin"), getUsers);

router.post("/", protect, authorize("Admin"), createUser);

export default router;
