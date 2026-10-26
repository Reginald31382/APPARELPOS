import express from "express";
import {
  getProducts,
  importProduct,
  getProductDetails,
  validateImportedPrintfulProduct,
  verifyPrintfulVariantIds,
  dryRunPrintfulVariant,
  deleteImportedPrintfulProduct,
} from "../controllers/printfulController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/products", protect, authorize("Admin", "Manager"), getProducts);

router.get(
  "/products/:id/details",
  protect,
  authorize("Admin", "Manager"),
  getProductDetails,
);

router.post(
  "/products/:id/import",
  protect,
  authorize("Admin", "Manager"),
  importProduct,
);

router.get(
  "/products/:id/validate",
  protect,
  authorize("Admin", "Manager"),
  validateImportedPrintfulProduct,
);

router.get(
  "/products/:id/dry-run-variant",
  protect,
  authorize("Admin", "Manager"),
  dryRunPrintfulVariant,
);

router.get(
  "/products/:id/verify-variants",
  protect,
  authorize("Admin", "Manager"),
  verifyPrintfulVariantIds,
);

router.get(
  "/test-connection",
  protect,
  authorize("Admin", "Manager"),
  async (req, res, next) => {
    try {
      const { getPrintfulProducts } =
        await import("../services/printfulService.js");

      await getPrintfulProducts();

      res.json({
        success: true,
        message: "Printful connection successful.",
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/products/:id/import",
  protect,
  authorize("Admin"),
  deleteImportedPrintfulProduct,
);

export default router;
