import express from "express";

import { getStore, updateStore } from "../controllers/storeController.js";

const router = express.Router();

router.get("/", getStore);

router.put("/", updateStore);

export default router;
