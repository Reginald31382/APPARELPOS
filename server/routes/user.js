import express from "express";

import { getUsers } from "../controllers/userController.js";

import { createUser } from "../controllers/userController.js";

import { updateUser } from "../controllers/userController.js";

import { resetPassword } from "../controllers/userController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize("Owner", "Admin"), getUsers);

router.post("/", protect, authorize("Owner", "Admin"), createUser);

router.put("/:id", protect, authorize("Owner", "Admin"), updateUser);

router.put("/:id/password", protect, authorize("Admin"), resetPassword);

export default router;
