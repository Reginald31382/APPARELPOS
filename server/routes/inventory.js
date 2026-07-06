import express from "express";

import { updateInventory } from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/", updateInventory);

export default router;
