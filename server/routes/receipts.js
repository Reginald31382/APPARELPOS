import express from "express";
import { getReceipts, getReceipt } from "../controllers/receiptController.js";

const router = express.Router();

router.get("/", getReceipts);

router.get("/:id", getReceipt);

export default router;
