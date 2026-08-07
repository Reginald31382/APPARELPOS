import Product from "../models/Products.js";
import InventoryHistory from "../models/InventoryHistory.js";
import { logger } from "../utils/logger.js";

export const getProducts = async (req, res) => {
  try {
    const {
      search = "",
      category,
      gender,
      brand,
      featured,
      latest,
      sort,
    } = req.query;

    let query = {};

    query.active = { $ne: false };

    // ONLY apply search if meaningful
    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { "variants.sku": { $regex: search, $options: "i" } },
      ];
    }

    if (category && category.trim() !== "") {
      query.category = category;
    }

    if (gender && gender.trim() !== "") {
      query.gender = gender;
    }

    if (brand && brand.trim() !== "") {
      query.brand = brand;
    }

    if (featured !== undefined && featured !== "") {
      query.featured = featured === "true";
    }

    if (latest === "true") {
      const thirtyDaysAgo = new Date();

      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      query.createdAt = {
        $gte: thirtyDaysAgo,
      };
    }

    // console.log("FINAL QUERY:", JSON.stringify(query, null, 2));

    let sortQuery = {};

    switch (sort) {
      case "priceLow":
        sortQuery.price = 1;
        break;

      case "priceHigh":
        sortQuery.price = -1;
        break;

      case "name":
        sortQuery.name = 1;
        break;

      case "featured":
        sortQuery.featured = -1;
        break;

      default:
        sortQuery.createdAt = -1;
    }

    const products = await Product.find(query).sort(sortQuery).lean();

    res.json(products);
  } catch (error) {
    logger.error("Product API Error", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, weight, variants } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Product name is required.",
      });
    }

    if (price === "" || price === undefined || price === null) {
      return res.status(400).json({
        message: "Price is required.",
      });
    }

    if (weight === "" || weight === undefined || weight === null) {
      return res.status(400).json({
        message: "Weight is required.",
      });
    }

    if (!variants?.length) {
      return res.status(400).json({
        message: "At least one product variant is required.",
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, weight, variants } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        message: "Product name is required.",
      });
    }

    if (price === "" || price === undefined || price === null) {
      return res.status(400).json({
        message: "Price is required.",
      });
    }

    if (weight === "" || weight === undefined || weight === null) {
      return res.status(400).json({
        message: "Weight is required.",
      });
    }

    if (!variants?.length) {
      return res.status(400).json({
        message: "At least one product variant is required.",
      });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const { sku, quantity, reason, notes } = req.body;

    const product = await Product.findOne({
      "variants.sku": sku,
    });

    if (!product) {
      return res.status(404).json({
        message: "Variant not found.",
      });
    }

    const variant = product.variants.find((v) => v.sku === sku);

    const previousQuantity = variant.quantity;

    variant.quantity = quantity;

    await product.save();

    await InventoryHistory.create({
      product: product._id,
      sku,
      productName: product.name,
      previousQuantity,
      newQuantity: quantity,
      adjustment: quantity - previousQuantity,
      reason,
      notes,
      performedBy: req.user._id,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
