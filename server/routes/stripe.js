import express from "express";
import { webhook } from "../controllers/stripeController.js";

const router = express.Router();

router.post("/", webhook);

export default router;
